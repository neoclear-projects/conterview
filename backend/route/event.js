const router = require('express').Router();
const Event = require('../model/event.model');

router.get('/', (req, res) => {
  Event.find({organizationId:req.organization._id})
    .populate({path:'user'})
    .populate({path:'item'})
    .exec((err, events) => {
    if (err) return res.status(500).send(err);
    return res.json(events);
  });
});

module.exports = router;