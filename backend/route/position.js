const router = require('express').Router();
const Position = require('../model/position.model');
const Interview = require('../model/interview.model');

router.post('/', (req, res) => {
  const { name, description } = req.body;
  Position.findOne({name, userId: req.session.user._id}, (err, position) => {
    if (err) return res.status(500).send(err);
    if (position) return res.status(409).send("Position with this name already exists");
    new Position({
      name, 
      userId: req.session.user._id, 
      description, 
      organizationId: req.organization._id,
      pendingInterviewNum: 0,
      finishedInterviewNum: 0})
      .save((err, position) => {
      if(err) return res.status(500).send(err);
      return res.json(position);
    });
  });
});

router.get('/', (req, res) => {
  Position.find({organizationId:req.organization._id}, req.fields).exec((err, positions) => {
    if (err) return res.status(500).send(err);
    return res.json(positions);
  });
});

router.use('/:positionId', (req, res, next) => {
  Position.findOne({_id:req.params.positionId}, function(err, position){
    if (err) return res.status(500).send(err);
    if (!position || !req.organization._id.equals(position.organizationId)) return res.status(404).send("position #" + req.params.positionId + " not found for organization #" + req.organization._id);
    req.position = position;
    next();
  });
});

router.patch('/:positionId', (req, res) => {
  Position.updateOne({_id:req.position._id}, { $set: req.body }, (err, position) => {
    if (err) return res.status(500).send(err);
    return res.json(position);
  });
});

router.get('/:positionId', (req, res) => {
  Position.findOne({_id:req.position._id}, req.fields).exec((err, position) => {
    if (err) return res.status(500).send(err);
    return res.json(position);
  });
});

router.delete('/:positionId', (req, res) => {
  Interview.remove({positionId:req.position._id}).exec((err) => {
    if (err) return res.status(500).send(err);
  });
  Position.remove({_id:req.position._id}, {justOne: true}).exec((err, position) => {
    if (err) return res.status(500).send(err);
    return res.json(position);
  });
});

const interview = require('./interview');

router.use('/:positionId/interview', interview);

module.exports = router;