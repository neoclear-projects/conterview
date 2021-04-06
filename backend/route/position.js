const router = require('express').Router();
const Position = require('../model/position.model');
const Interview = require('../model/interview.model');
const Event = require('../model/event.model');
const isOrgUser = require('../access/isOrgUser');

function event(action, req, position){
  return {
    user: req.session.user._id,
    action,
    itemType: 'position',
    item1: {_id: position._id, name: position.name},
    time: new Date(),
    organizationId: req.organization._id,
  }
}

router.use(isOrgUser);

router.post('/', (req, res) => {
  const { name, description } = req.body;
  Position.findOne({name, organizationId:req.organization._id}, (err, position) => {
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
      new Event(event('create', req, position)).save(err => {if(err) return res.status(500).send(err);});
      return res.json(position);
    });
  });
});

router.get('/', (req, res) => {
  let { page, nameContains, allFinished } = req.query;
  let query = {organizationId:req.organization._id};
  if(nameContains) query['name'] = { "$regex": nameContains, "$options": "i" };
  if(allFinished){
    query['pendingInterviewNum'] = 0;
    query['finishedInterviewNum'] = { "$gt": 0 }
  }
  if(!page){
    Position.find(query, req.fields).exec((err, positions) => {
      if (err) return res.status(500).send(err);
      return res.json({positions});
    });
  }else{
    Position.find(query, req.fields).skip((page-1)*10).limit(10).exec((err, positions) => {
      if (err) return res.status(500).send(err);
      Position.countDocuments(query, (err, count) => {
        if (err) return res.status(500).send(err);
        let response = {};
        response.totalPage = Math.ceil(count/10);
        response.positions = positions;
        return res.json(response);
      });
    });
  }
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
    new Event(event('update', req, position)).save(err => {if(err) return res.status(500).send(err);});
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
  Interview.remove({'position':req.position._id}).exec((err) => {
    if (err) return res.status(500).send(err);
  });
  Position.remove({_id:req.position._id}, {justOne: true}).exec((err) => {
    if (err) return res.status(500).send(err);
    new Event(event('delete', req, req.position)).save(err => {if(err) return res.status(500).send(err);});
    return res.json(req.position);
  });
});

const interview = require('./interview');

router.use('/:positionId/interview', interview);

module.exports = router;