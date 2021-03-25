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
    console.log(problem);
    problems.push(problem)});
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
  Interview.find({'position._id':req.position._id}, req.fields).lean().exec((err, interviews) => {
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

router.delete('/:interviewId', (req, res) => {
  Interview.remove({_id:req.interview._id}, {justOne: true}).exec((err, interview) => {
    if (err) return res.status(500).send(err);
    return res.json(interview);
  });
});

router.get('/:interviewId/problem/:problem_number', (req, res) => {
  Interview.findOne({_id:req.interview._id}, {problemIds: 1}).exec((err, interview) => {
    if (err) return res.status(500).send(err);
    Problem.findOne({_id:interview.problemIds[problem_number]}).exec((err, problem) => {
      if (err) return res.status(500).send(err);
      if (!problem) return res.status(404).send('Problem not found');
      return res.json(problem);
    });
  });
});

module.exports = router;