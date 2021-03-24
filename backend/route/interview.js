const router = require('express').Router();
const Interview = require('../model/interview.model');
const sendMail = require('../util/mail');
const toObjectId = require('../util/object-id');

router.post('/', (req, res) => {
  const { candidate, interviewerIds, problemIds, time } = req.body;
  new Interview({
    candidate,
    interviewerIds:interviewerIds.map(toObjectId),
    problemIds:problemIds.map(toObjectId),
    positionId:req.position._id,
    organizationId:req.organization._id,
    time:new Date(time),
    status:'pending'
  }).save((err, interview) => {
    if(err) return res.status(500).send(err);
    /*
    sendMail(interview.candidate.email, 
      `Interview scheduled for ${req.position.name} position at ${req.organization.name} `, 
      `
        <p>Congratulations! You received an interview for ${req.position.name} position at ${req.organization.name}</p>
        <p>The interview is scheduled at ${interview.time.toUTCString()} on Conterview:</p>
        <p>${require('config').get('frontend.url')}/running-interview/${interview._id}</p>
      `
    );
    */
    return res.json(interview);
  });
});

router.use('/:interviewId', (req, res, next) => {
  Interview.findOne({_id:req.params.interviewId}, function(err, interview){
    if (err) return res.status(500).send(err);
    if (!interview || !req.position._id.equals(interview.positionId)) return res.status(404).send("interview #" + interview._id + " not found for position #" + req.position._id);
    req.interview = interview;
    next();
  });
});

router.get('/:interviewId', (req, res) => {
  Interview.findOne({_id:req.params.interviewId}, req.fields).lean().exec((err, interview) => {
    if (err) return res.status(500).send(err);
    interview.position = { name: req.position.name, _id: req.position._id};
    delete interview.positionId;
    return res.json(interview);
  });
});

module.exports = router;