const router = require('express').Router();
const Interview = require('../model/interview.model');
const sendMail = require('../util/mail');
const toObjectId = require('../util/object-id');
const Problem = require('../model/problem-set.model').ProblemSet;
const Position = require('../model/position.model');
const User = require('../model/user.model');
const Event = require('../model/event.model');

function event(action, req, interview, position){
  return {
    user: req.session.user._id,
    action,
    itemTypeRef: 'Interview',
    itemType: 'interview',
    item1: {_id: interview._id, name: interview.candidate.name},
    item2: {_id: position._id, name: position.name},
    time: new Date(),
    organizationId: req.organization._id,
  }
}

router.post('/', (req, res) => {
  const { candidate, interviewerIds, problemIds, scheduledTime, scheduledLength } = req.body;

  new Interview({
    candidate,
    interviewers: interviewerIds,
    problems: problemIds,
    position: req.position._id,
    organizationId:req.organization._id,
    scheduledTime:new Date(scheduledTime),
    scheduledLength,
    status:'pending'
  }).save((err, interview) => {
    if(err) return res.status(500).send(err);
    Position.updateOne({_id:req.position._id}, { $inc: {pendingInterviewNum:1} }, (err, position) => {
      if (err) return res.status(500).send(err);
    });
    sendMail(interview.candidate.email, 
      `Interview scheduled for ${req.position.name} position at ${req.organization.name} `, 
      `
        <p>Congratulations! You received an interview for ${req.position.name} position at ${req.organization.name}</p>
        <p>The interview is scheduled at ${interview.scheduledTime.toUTCString()} on Conterview:</p>
        <p>https://www.conterview.com/position/${req.position._id}/interview/${interview._id}/running</p>
      `
    );
    new Event(event('create', req, interview, req.position)).save(err => {if(err) return res.status(500).send(err);});
    return res.json(interview);
  });
});

router.get('/', (req, res) => {
  let page = req.query.page;
  if(page === undefined) page = 1;
  let query = {'position':req.position._id};
  if(req.query.status !== undefined){
    query['status'] = req.query.status;
  }
  Interview
    .find(query)
    .skip((page-1)*10).limit(10)
    .populate({path:'position'})
    .populate({path:'interviewers'})
    .populate({path:'problems'})
    .exec((err, interviews) => {
    if (err) return res.status(500).send(err);
    return res.json(interviews);
  });
});

router.use('/:interviewId', (req, res, next) => {
  Interview
    .findOne({_id:req.params.interviewId})
    .exec((err, interview) => {
    if (err) return res.status(500).send(err);
    if (!interview || !req.position._id.equals(interview.position)) return res.status(404).send("interview #" + req.params.interviewId + " not found for position #" + req.position._id);
    req.interview = interview;
    next();
  });
});

router.get('/:interviewId', (req, res) => {
  Interview
    .findOne({_id:req.interview._id})
    .populate({path:'position'})
    .populate({path:'interviewers'})
    .populate({path:'problems'})
    .exec((err, interview) => {
    if (err) return res.status(500).send(err);
    return res.json(interview);
  });
});

router.patch('/:interviewId', (req, res) => {
  const { candidate, interviewerIds, problemIds, scheduledTime, scheduledLength } = req.body;

  let interview = {
    candidate,
    interviewers: interviewerIds,
    problems: problemIds,
    scheduledTime:new Date(scheduledTime),
    scheduledLength,
  };
  
  Interview.
    findOneAndUpdate({_id:req.interview._id}, { $set: interview }, { returnOriginal: false }, (err, interview) => {
    if (err) return res.status(500).send(err);
    new Event(event('update', req, interview, req.position)).save(err => {if(err) return res.status(500).send(err);});
    return res.json(interview);
  });
});

router.delete('/:interviewId', (req, res) => {
  Interview
    .remove({_id:req.interview._id}, {justOne: true})
    .exec((err, interview) => {
    if (err) return res.status(500).send(err);
    new Event(event('delete', req, req.interview, req.position)).save(err => {if(err) return res.status(500).send(err);});
    return res.json(interview);
  });
});

router.patch('/:interviewId/status', (req, res) => {
  let status = req.body.status;
  if(status === undefined) return res.status(400).send('status not provided');
  switch(status){
    case 'running':
      Interview
        .findOne({_id:req.interview._id})
        .populate({path:'problems'})
        .exec((err, interview) => {
        if (err) return res.status(500).send(err);
        interview.status = 'running';
        interview.startTime = new Date();
        interview.currentProblemIndex = -1;
        interview.problemsSnapshot = interview.problems;
        interview.save((err, interview) => {
          if (err) return res.status(500).send(err);
          return res.json(interview);
        });
      });
      break;
    case 'finished':
      Interview
        .findOne({_id:req.interview._id})
        .exec((err, interview) => {
        interview.status = 'finished';
        interview.finishTime = new Date();
        interview.totalGrade = getInterviewTotalGrade(interview);
        interview.maxTotalGrade = getInterviewMaxTotalGrade(interview);
        Position.updateOne({_id:req.position._id}, { $inc: {finishedInterviewNum:1, pendingInterviewNum:-1} }, (err) => {
          if (err) return res.status(500).send(err);
        });
        interview.save((err, interview) => {
          if (err) return res.status(500).send(err);
          return res.json(interview);
        });
      });
      break;
    default:
      return res.status(400).send('invalid status');
  }
});

router.patch('/:interviewId/current-problem-index', (req, res) => {
  Interview.findOne({_id:req.interview._id}).exec((err, interview) => {
    if (err) return res.status(500).send(err);
    let target;
    if(req.body.index !== undefined){
      target = req.body.index;
    }else if(req.body.next !== undefined){
      target = interview.currentProblemIndex + 1;
    }else if(req.body.prev !== undefined){
      target = interview.currentProblemIndex - 1;
    }else{
      return res.status(400).send('index or next or prev should be specified');
    }
    if(target >= interview.problemsSnapshot.length || target < 0) return res.status(404).send('no specified problem available');
    interview.currentProblemIndex = target;
    interview.save((err, interview) => {
      if (err) return res.status(500).send(err);
      return res.json(interview.problemsSnapshot[target]);
    });
  });
});

// router.patch('/:interviewId/problem/:index/rating', (req, res) => {
//   Interview.findOne({_id:req.interview._id}).exec((err, interview) => {
//     if (err) return res.status(500).send(err);
//     if(interview.problemsSnapshot[req.params.index].problemRubric.length !== req.body.rating.length) return res.status(400).send('incorrect number of ratings');
//     for(let i=0;i<req.body.rating.length;i++){
//       interview.problemsSnapshot[req.params.index].problemRubric[i].curRating = req.body.rating[i];
//     }
//     interview.save((err, interview) => {
//       if (err) return res.status(500).send(err);
//       return res.json(interview.problemsSnapshot[req.params.index].problemRubric);
//     });
//   });
// });

router.patch('/:interviewId/problem/:index/evaluation', (req, res) => {
  Interview.findOne({_id:req.interview._id}).exec((err, interview) => {
    if (err) return res.status(500).send(err);
    if(req.body.grade){
      let { idx, value } = req.body.grade;
      if (idx >= interview.problemsSnapshot[req.params.index].problemRubric.length || idx < 0) return res.status(400).send('incorrect index of rubric');
      interview.problemsSnapshot[req.params.index].problemRubric[idx].curRating = value;
    }
    if(req.body.comment){
      interview.problemsSnapshot[req.params.index].comment = req.body.comment;
    }
    interview.save((err, interview) => {
      if (err) return res.status(500).send(err);
      return res.json(interview.problemsSnapshot[req.params.index].problemRubric);
    });
  });
});

module.exports = router;

function getProblemTotalGrade(problem){
  return problem.problemRubric.map(rubric => {return rubric.curRating}).reduce((pv, cv) => pv + cv, 0);
}

function getInterviewTotalGrade(interview){
  return interview.problemsSnapshot.map(getProblemTotalGrade).reduce((pv, cv) => pv + cv, 0);
}

function getProblemMaxTotalGrade(problem){
  return problem.problemRubric.map(rubric => {return rubric.rating}).reduce((pv, cv) => pv + cv, 0);
}

function getInterviewMaxTotalGrade(interview){
  return interview.problemsSnapshot.map(getProblemMaxTotalGrade).reduce((pv, cv) => pv + cv, 0);
}
