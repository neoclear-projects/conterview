"use strict";

const router = require('express').Router();
const Interview = require('../model/interview.model');
const Position = require('../model/position.model');
const isOrgUser = require('../access/isOrgUser');
const { query } = require('express-validator');
const handleValidationResult = require('../util/validation-result');

router.get('/', isOrgUser, 
  [query('page', 'page should be non-negative integer').optional().isInt({min:1}),
  query('candidateContains', 'candidateContains should be non-empty string').optional().isString().notEmpty().escape(),
  query('positionContains', 'positionContains should be non-empty string').optional().isString().notEmpty().escape(),
  query('status', 'status should be in pending, running or finished').optional().isIn(['pending', 'runnning', 'finished'])],
  handleValidationResult,
  async (req, res) => {
  let { page, candidateContains, positionContains, status } = req.query;
  if(!page) page = 1;
  let query = {organizationId:req.organization._id};
  if(status) query.status = status;
  if(candidateContains) query['candidate.name'] = { "$regex": candidateContains, "$options": "i" };
  if(positionContains){
    let positionIds = [];
    await Position.find({organizationId:req.organization._id, name: { "$regex": positionContains, "$options": "i" }}).exec().then(positions => {
      positions.forEach(position => {
        positionIds.push(position._id);
      });
    });
    query.position = { "$in": positionIds };
  }
  Interview.
    find(query, req.fields)
    .sort({_id:-1})
    .skip((page-1)*10).limit(10)
    .populate({path:'position', select:'name'})
    .exec((err, interviews) => {
    if (err) return res.status(500).send(err);
    Interview.countDocuments(query, (err, count) => {
      if (err) return res.status(500).send(err);
      let response = {};
      response.totalPage = Math.ceil(count/10);
      response.interviews = interviews.map(interview => {
        const { _id, candidate, scheduledTime, status, position } = interview;
        return { _id, candidate, scheduledTime, status, position };
      });
      return res.json(response);
    });
  });
});

module.exports = router;