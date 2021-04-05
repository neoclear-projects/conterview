const router = require('express').Router();
const Interview = require('../model/interview.model');
const Position = require('../model/position.model');
const async = require('async');

router.get('/', async (req, res) => {
  let { page, candidateContains, positionContains, status } = req.query;
  if(!page) page = 1;
  let query = {organizationId:req.organization._id};
  if(status) query['status'] = status;
  if(candidateContains) query['candidate.name'] = { "$regex": candidateContains, "$options": "i" };
  if(positionContains){
    positionIds = [];
    await Position.find({organizationId:req.organization._id, name: { "$regex": positionContains, "$options": "i" }}).exec().then(positions => {
      positions.forEach(position => {
        positionIds.push(position._id);
      });
    });
    query['position'] = { "$in": positionIds };
  }
  Interview.
    find(query, req.fields)
    .skip((page-1)*10).limit(10)
    .populate({path:'position'})
    .populate({path:'interviewers'})
    .populate({path:'problems'})
    .exec((err, interviews) => {
    if (err) return res.status(500).send(err);
    Interview.countDocuments(query, (err, count) => {
      if (err) return res.status(500).send(err);
      let response = {};
      response.totalPage = Math.ceil(count/10);
      response.interviews = interviews;
      return res.json(response);
    });
  });
});

module.exports = router;