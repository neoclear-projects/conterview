const router = require('express').Router();
const Interview = require('../model/interview.model');
const sendMail = require('../util/mail');
const toObjectId = require('../util/object-id');
const Problem = require('../model/problem-set.model');
const Position = require('../model/position.model');
const User = require('../model/user.model');
const async = require('async');

router.post('/', async (req, res) => {
  const { candidate, interviewerIds, problemIds, scheduledTime, scheduledLength } = req.body;

  let interviewers = [];
  await async.eachSeries(interviewerIds, async (interviewerId) => {
    await User.findOne({_id:interviewerId},{username:1}).exec().then(interviewer => interviewers.push(interviewer));
  });

  let problems = [];
  await async.eachSeries(problemIds, async (problemId) => {
    await Problem.findOne({_id:problemId},{problemName:1}).exec().then(problem => {
      problems.push(problem)
    });
  });

  new Interview({
    candidate,
    interviewers,
    problems,
    position:{ name: req.position.name, _id: req.position._id},
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
    return res.json(interview);
  });
});

router.get('/', (req, res) => {
  let page = req.query.page;
  if(page === undefined) page = 1;
  Interview.find({'position._id':req.position._id}, req.fields).skip((page-1)*10).limit(10).exec((err, interviews) => {
    if (err) return res.status(500).send(err);
    return res.json(interviews);
  });
});

router.use('/:interviewId', (req, res, next) => {
  Interview.findOne({_id:req.params.interviewId}, function(err, interview){
    if (err) return res.status(500).send(err);
    if (!interview || !req.position._id.equals(interview.position._id)) return res.status(404).send("interview #" + req.params.interviewId + " not found for position #" + req.position._id);
    req.interview = interview;
    next();
  });
});

router.get('/:interviewId', (req, res) => {
  Interview.findOne({_id:req.interview._id}, req.fields).exec((err, interview) => {
    if (err) return res.status(500).send(err);
    return res.json(interview);
  });
});

router.patch('/:interviewId', async (req, res) => {
  const { candidate, interviewerIds, problemIds, scheduledTime, scheduledLength } = req.body;

  let interviewers = [];
  await async.eachSeries(interviewerIds, async (interviewerId) => {
    await User.findOne({_id:interviewerId},{username:1}).exec().then(interviewer => interviewers.push(interviewer));
  });

  let problems = [];
  await async.eachSeries(problemIds, async (problemId) => {
    await Problem.findOne({_id:problemId},{problemName:1}).exec().then(problem => {
    console.log(problem);
    problems.push(problem)});
  });

  let interview = {
    candidate,
    interviewers,
    problems,
    scheduledTime:new Date(scheduledTime),
    scheduledLength,
  };
  
  Interview.findOneAndUpdate({_id:req.interview._id}, { $set: interview }, { returnOriginal: false }, (err, interview) => {
    if (err) return res.status(500).send(err);
    return res.json(interview);
  });
});

router.delete('/:interviewId', (req, res) => {
  Interview.remove({_id:req.interview._id}, {justOne: true}).exec((err, interview) => {
    if (err) return res.status(500).send(err);
    return res.json(interview);
  });
});

router.get('/:interviewId/start', (req, res) => {
  Interview.findOneAndUpdate({_id:req.interview._id}, { $set: {startTime:new Date(), status:'running', currentProblemIndex:-1} }, { returnOriginal: false }, (err, interview) => {
    if (err) return res.status(500).send(err);
    return res.json(interview);
  });
});

router.get('/:interviewId/end', (req, res) => {
  Interview.findOneAndUpdate({_id:req.interview._id}, { $set: {finishTime:new Date(), status:'finished'} }, { returnOriginal: false }, (err, interview) => {
    if (err) return res.status(500).send(err);
    Position.updateOne({_id:req.position._id}, { $inc: {finishedInterviewNum:1, pendingInterviewNum:-1} }, (err) => {
      if (err) return res.status(500).send(err);
      return res.json(interview);
    });
  });
});

router.get('/:interviewId/next-problem', (req, res) => {
  Interview.findOne({_id:req.interview._id}).exec((err, interview) => {
    if (err) return res.status(500).send(err);
    if(interview.currentProblemIndex + 1 >= interview.problems.length) return res.status(404).send('no next problem available');
    interview.currentProblemIndex = interview.currentProblemIndex + 1;
    interview.save((err, interview) => {
      Problem.findOne({_id:interview.problems[interview.currentProblemIndex]._id}).exec((err, problem) => {
        if (err) return res.status(500).send(err);
        if (!problem) return res.status(404).send('Problem not found');
        return res.json(problem);
      });
    });
  });
});

router.get('/:interviewId/prev-problem', (req, res) => {
  Interview.findOne({_id:req.interview._id}).exec((err, interview) => {
    if (err) return res.status(500).send(err);
    if(interview.currentProblemIndex - 1 < 0) return res.status(404).send('no previous problem available');
    interview.currentProblemIndex = interview.currentProblemIndex - 1;
    interview.save((err, interview) => {
      Problem.findOne({_id:interview.problems[interview.currentProblemIndex]._id}).exec((err, problem) => {
        if (err) return res.status(500).send(err);
        if (!problem) return res.status(404).send('Problem not found');
        return res.json(problem);
      });
    });
  });
});

router.get('/:interviewId/problem/:problemId', (req, res) => {
  Interview.findOne({_id:req.interview._id}).exec((err, interview) => {
    if (err) return res.status(500).send(err);
    const idx = req.params.problemId;
    if (idx < 0 || idx >= interview.problems.length) return res.status(404).send('no problem available');
    interview.currentProblemIndex = idx;
    interview.save((err, interview) => {
      Problem.findOne({_id:interview.problems[interview.currentProblemIndex]._id}).exec((err, problem) => {
        if (err) return res.status(500).send(err);
        if (!problem) return res.status(404).send('Problem not found');
        return res.json(problem);
      });
    });
  });
});

module.exports = router;