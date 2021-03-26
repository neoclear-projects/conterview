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
  let page = req.query.page;
  if(!page) page = 1;
  Position.find({organizationId:req.organization._id}, req.fields).skip((page-1)*10).limit(10).exec((err, positions) => {
    if (err) return res.status(500).send(err);
    Position.countDocuments({organizationId:req.organization._id}, (err, count) => {
      if (err) return res.status(500).send(err);
      let response = {};
      response.totalPage = Math.ceil(count/10);
      response.positions = positions;
      return res.json(response);
    });
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
  Position.findOneAndUpdate({_id:req.position._id}, { $set: req.body }, { returnOriginal: false }, (err, position) => {
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
  Interview.remove({'position._id':req.position._id}).exec((err) => {
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