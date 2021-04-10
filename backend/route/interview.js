"use strict";

const router = require('express').Router();
const Interview = require('../model/interview.model');
const sendMail = require('../util/mail');
const Position = require('../model/position.model');
const Event = require('../model/event.model');
const isOrgUser = require('../access/isOrgUser');
const crypto = require('crypto');
const ObjectId = require('mongoose').Types.ObjectId;
const { body, param, query } = require('express-validator');
const handleValidationResult = require('../util/validation-result');

function event(action, req, interview, position){
  return {
    user: req.session.user._id,
    action,
    itemType: 'interview',
    item1: {_id: interview._id, name: interview.candidate.name},
    item2: {_id: position._id, name: position.name},
    time: new Date(),
    organizationId: req.organization._id,
  };
}

function allObjectIds(ids){
  for(let id of ids){
    if(!ObjectId.isValid(id)) return false;
  }
  return true;
}

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str); 
  return d.toISOString()===str;
}

router.post('/', isOrgUser, 
  [body('candidate.name', 'candidate name is needed and should be non-empty string').isString().notEmpty().escape(), 
  body('candidate.email', 'candidate email is needed and should be email formatted').isEmail(),
  body('problemIds', 'problemIds is needed and cannot be empty').custom(value => {return value.length > 0;}),
  body('problemIds', 'problemIds should be valid objectIds').custom(allObjectIds),
  body('interviewerIds', 'interviewerIds is needed and cannot be empty').custom(value => {return value.length > 0;}),
  body('interviewerIds', 'interviewerIds should be valid objectIds').custom(allObjectIds),
  body('scheduledTime', 'scheduledTime is needed and should be in ISOString format').custom(isIsoDate),
  body('scheduledLength', 'scheduledLength is needed and should be positive integer').isInt({gt:0})],
  handleValidationResult,
  (req, res) => {
  const { candidate, interviewerIds, problemIds, scheduledTime, scheduledLength } = req.body;

  let passcode = crypto.randomBytes(16).toString('base64');
  let salt = crypto.randomBytes(16).toString('base64');
  let hash = crypto.createHmac('sha512', salt);
  hash.update(passcode);
  let saltedHash = hash.digest('base64');
  console.log(passcode);

  new Interview({
    candidate,
    interviewers: interviewerIds,
    problems: problemIds,
    position: req.position._id,
    organizationId:req.organization._id,
    scheduledTime:new Date(scheduledTime),
    scheduledLength,
    status:'pending',
    salt,
    saltedHash,
  }).save((err, interview) => {
    if(err) return res.status(500).send(err);
    Position.updateOne({_id:req.position._id}, { $inc: {pendingInterviewNum:1} }, err => {
      if (err) return res.status(500).send(err);
    });
    sendMail(interview.candidate.email, 
      `Interview scheduled for ${req.position.name} position at ${req.organization.name} `, 
      `
        <p>Congratulations! You received an interview for ${req.position.name} position at ${req.organization.name}</p>
        <p>The interview is scheduled at ${interview.scheduledTime.toUTCString()} on Conterview:</p>
        <p>https://www.conterview.com/position/${req.position._id}/interview/${interview._id}/running?passcode=${passcode}</p>
      `
    );
    new Event(event('create', req, interview, req.position)).save(err => {if(err) return res.status(500).send(err);});
    const { _id, candidate, problemIds, interviewIds, scheduledTime, scheduledLength } = interview;
    return res.json({ _id, candidate, problemIds, interviewIds, scheduledTime, scheduledLength });
  });
});

router.get('/', isOrgUser, 
  [query('status', 'status should be in pending, running or finished').optional().isIn(['pending', 'runnning', 'finished'])],
  handleValidationResult,
  (req, res) => {
  let query = {'position':req.position._id};
  if(req.query.status !== undefined){
    query.status = req.query.status;
  }
  Interview
    .find(query)
    .exec((err, interviews) => {
    if (err) return res.status(500).send(err);
    return res.json(interviews.map(interview => {
      const { _id, candidate, scheduledTime, status, totalGrade, maxTotalGrade } = interview;
      return { _id, candidate, scheduledTime, status, totalGrade, maxTotalGrade };
    }));
  });
});

router.use('/:interviewId', 
  [param('interviewId', 'id invalid: interview').custom((value) => {return ObjectId.isValid(value);})],
  handleValidationResult,
  (req, res, next) => {
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
    .populate({path:'position', select:'name'})
    .populate({path:'interviewers', select:'username email department title personalStatement'})
    .populate({path:'problems', select:'problemName'})
    .exec((err, interview) => {
    console.log(err);
    if (err) return res.status(500).send(err);
    const { _id, candidate, problems, interviewers, problemsSnapshot, position, scheduledTime, startTime, finishTime, status, scheduledLength, currentProblemIndex, totalGrade, maxTotalGrade } = interview;
    return res.json({ _id, candidate, problems, interviewers, problemsSnapshot, position, scheduledTime, startTime, finishTime, status, scheduledLength, currentProblemIndex, totalGrade, maxTotalGrade });
  });
});

router.patch('/:interviewId', isOrgUser, 
  [body('candidate.name', 'candidate name should be non-empty string').optional().isString().notEmpty().escape(), 
  body('candidate.email', 'candidate email should be email formatted').optional().isEmail(),
  body('problemIds', 'problemIds cannot be empty').optional().custom(value => {return value.length > 0;}),
  body('problemIds', 'problemIds should be valid objectIds').optional().custom(allObjectIds),
  body('interviewerIds', 'interviewerIds cannot be empty').optional().custom(value => {return value.length > 0;}),
  body('interviewerIds', 'interviewerIds should be valid objectIds').optional().custom(allObjectIds),
  body('scheduledTime', 'scheduledTime should be in ISOString format').optional().custom(isIsoDate),
  body('scheduledLength', 'scheduledLength should be positive integer').optional().isInt({gt:0})],
  handleValidationResult,
  (req, res) => {
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
    const { _id, candidate, problemIds, interviewIds, scheduledTime, scheduledLength } = interview;
    return res.json({ _id, candidate, problemIds, interviewIds, scheduledTime, scheduledLength });
  });
});

router.delete('/:interviewId', isOrgUser, (req, res) => {
  if(req.interview.status !== 'pending') return res.status(403).send('cannot delete a non-pending interview');
  Position.updateOne({_id:req.position._id}, { $inc: {pendingInterviewNum:-1} }, (err) => {
    if (err) return res.status(500).send(err);
  });
  Interview
    .remove({_id:req.interview._id}, {justOne: true})
    .exec((err, interview) => {
    if (err) return res.status(500).send(err);
    new Event(event('delete', req, req.interview, req.position)).save(err => {if(err) return res.status(500).send(err);});
    const { _id, candidate, scheduledTime, status } = interview;
    return res.json({ _id, candidate, scheduledTime, status });
  });
});

router.patch('/:interviewId/status', isOrgUser, 
  [body('status', 'status should be in running or finished').isIn(['running', 'finished'])],
  handleValidationResult,
  (req, res) => {
  let status = req.body.status;
  switch(status){
    case 'running':
      Interview
        .findOne({_id:req.interview._id})
        .populate({path:'problems'})
        .exec((err, interview) => {
        if (err) return res.status(500).send(err);
        if(interview.status !== 'pending') return res.status(403).send('can only set to running from pending');
        interview.status = 'running';
        interview.startTime = new Date();
        interview.currentProblemIndex = -1;
        interview.problemsSnapshot = interview.problems;
        interview.save((err, interview) => {
          if (err) return res.status(500).send(err);
          const { _id, candidate, scheduledTime, status } = interview;
          return res.json({ _id, candidate, scheduledTime, status });
        });
      });
      break;
    case 'finished':
      Interview
        .findOne({_id:req.interview._id})
        .exec((err, interview) => {
        if (err) return res.status(500).send(err);
        if(interview.status !== 'running') return res.status(403).send('can only set to finished from running');
        interview.status = 'finished';
        interview.finishTime = new Date();
        interview.totalGrade = getInterviewTotalGrade(interview);
        interview.maxTotalGrade = getInterviewMaxTotalGrade(interview);
        Position.updateOne({_id:req.position._id}, { $inc: {finishedInterviewNum:1, pendingInterviewNum:-1} }, (err) => {
          if (err) return res.status(500).send(err);
        });
        interview.save((err, interview) => {
          if (err) return res.status(500).send(err);
          const { _id, candidate, scheduledTime, status } = interview;
          return res.json({ _id, candidate, scheduledTime, status });
        });
      });
      break;
  }
});

router.patch('/:interviewId/current-problem-index', isOrgUser, 
  [body('index', 'index should be non-negative int').optional().isInt({min:0}),
  body('next', 'next should be true').optional().custom(value => {return value == true;}),
  body('prev', 'prev should be true').optional().custom(value => {return value == true;})],
  handleValidationResult,
  (req, res) => {
  Interview.findOne({_id:req.interview._id}).exec((err, interview) => {
    if (err) return res.status(500).send(err);
    let target;
    if(req.body.index !== undefined){
      target = req.body.index;
    }else if(req.body.next){
      target = interview.currentProblemIndex + 1;
    }else if(req.body.prev){
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

router.use('/:interviewId/problem', require('./interview-problem'));

module.exports = router;

function getProblemTotalGrade(problem){
  return problem.problemRubric.map(rubric => {return rubric.curRating;}).reduce((pv, cv) => pv + cv, 0);
}

function getInterviewTotalGrade(interview){
  return interview.problemsSnapshot.map(getProblemTotalGrade).reduce((pv, cv) => pv + cv, 0);
}

function getProblemMaxTotalGrade(problem){
  return problem.problemRubric.map(rubric => {return rubric.rating;}).reduce((pv, cv) => pv + cv, 0);
}

function getInterviewMaxTotalGrade(interview){
  return interview.problemsSnapshot.map(getProblemMaxTotalGrade).reduce((pv, cv) => pv + cv, 0);
}
