"use strict";

const router = require('express').Router();
const Position = require('../model/position.model');
const Interview = require('../model/interview.model');
const Event = require('../model/event.model');
const isOrgUser = require('../access/isOrgUser');
const ObjectId = require('mongoose').Types.ObjectId;
const { body, query, param } = require('express-validator');
const handleValidationResult = require('../util/validation-result');

function event(action, req, position){
  return {
    user: req.session.user._id,
    action,
    itemType: 'position',
    item1: {_id: position._id, name: position.name},
    time: new Date(),
    organizationId: req.organization._id,
  };
}

router.post('/', isOrgUser, 
  [body('name', 'position name is needed and should be non-empty string').isString().notEmpty().escape(), 
  body('description', 'position description is needed and should be non-empty string').isString().notEmpty().escape()],
  handleValidationResult,
  (req, res) => {
  const { name, description } = req.body;
  Position.findOne({name, organizationId:req.organization._id}, (err, position) => {
    if (err) return res.status(500).send(err);
    if (position) return res.status(409).send("Position with this name already exists");
    new Position({
      name,
      description, 
      organizationId: req.organization._id,
      pendingInterviewNum: 0,
      finishedInterviewNum: 0})
      .save((err, position) => {
      if(err) return res.status(500).send(err);
      new Event(event('create', req, position)).save(err => {if(err) return res.status(500).send(err);});
      const { _id, name, description } = position;
      return res.json({ _id, name, description });
    });
  });
});

router.get('/', isOrgUser, 
  [query('page', 'page should be non-negative integer').optional().isInt({min:1}), 
  query('nameContains', 'nameContains should be non-empty string').optional().isString().notEmpty().escape(),
  query('allFinished', 'allFinished should be boolean').optional().isBoolean(),],
  handleValidationResult,
  (req, res) => {
  let { page, nameContains, allFinished } = req.query;
  let query = {organizationId:req.organization._id};
  if(nameContains) query.name = { "$regex": nameContains, "$options": "i" };
  if(allFinished){
    query.pendingInterviewNum = 0;
    query.finishedInterviewNum = { "$gt": 0 };
  }
  if(!page) page = 1;
  Position.find(query, req.fields).sort({_id:-1}).skip((page-1)*10).limit(10).exec((err, positions) => {
    if (err) return res.status(500).send(err);
    Position.countDocuments(query, (err, count) => {
      if (err) return res.status(500).send(err);
      let response = {};
      response.totalPage = Math.ceil(count/10);
      response.positions = positions.map(position =>{
        const { _id, name, description, pendingInterviewNum, finishedInterviewNum } = position;
        return { _id, name, description, pendingInterviewNum, finishedInterviewNum};
      });
      return res.json(response);
    });
  });
});

router.use('/:positionId', 
  [param('positionId', 'id invalid: position').custom((value) => {return ObjectId.isValid(value);})],
  handleValidationResult,
  (req, res, next) => {
  Position.findOne({_id:req.params.positionId}, function(err, position){
    if (err) return res.status(500).send(err);
    if (!position || !req.organization._id.equals(position.organizationId)) return res.status(404).send("position #" + req.params.positionId + " not found for organization #" + req.organization._id);
    req.position = position;
    next();
  });
});

router.patch('/:positionId', isOrgUser,
  [body('name', 'position name should be non-empty string').optional().isString().notEmpty().escape(), 
  body('description', 'position description should be non-empty string').optional().isString().notEmpty().escape()],
  handleValidationResult, 
  (req, res) => {
  const { name, description } = req.body;
  Position.findOne({name, organizationId:req.organization._id}).exec((err, position) => {
    if (err) return res.status(500).send(err);
    if(req.position.name !== name && position) return res.status(409).send("Position with this name already exists");
    Position.findOneAndUpdate({_id:req.position._id}, { $set: { name, description } }, { returnOriginal: false }, (err, position) => {
      if (err) return res.status(500).send(err);
      new Event(event('update', req, position)).save(err => {if(err) return res.status(500).send(err);});
      const { _id, name, description } = position;
      return res.json({ _id, name, description });
    });
  });
});

router.get('/:positionId', isOrgUser, (req, res) => {
  Position.findOne({_id:req.position._id}, req.fields).exec((err, position) => {
    if (err) return res.status(500).send(err);
    const { _id, name, description, pendingInterviewNum, finishedInterviewNum } = position;
    return res.json({ _id, name, description, pendingInterviewNum, finishedInterviewNum });
  });
});

router.delete('/:positionId', isOrgUser, (req, res) => {
  Interview.remove({'position':req.position._id}).exec((err) => {
    if (err) return res.status(500).send(err);
  });
  Position.remove({_id:req.position._id}, {justOne: true}).exec((err) => {
    if (err) return res.status(500).send(err);
    new Event(event('delete', req, req.position)).save(err => {if(err) return res.status(500).send(err);});
    const { _id, name, description, pendingInterviewNum, finishedInterviewNum } = req.position;
    return res.json({ _id, name, description, pendingInterviewNum, finishedInterviewNum });
  });
});

const interview = require('./interview');

router.use('/:positionId/interview', interview);

module.exports = router;