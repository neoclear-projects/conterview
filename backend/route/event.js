const router = require('express').Router();
const Event = require('../model/event.model');

router.get('/', (req, res) => {
  let page = req.query.page;
  if(!page) page = 1;
  Event.find({organizationId:req.organization._id})
    .sort({time:-1})
    .skip((page-1)*5).limit(5)
    .populate({path:'user'})
    .exec((err, events) => {
    if (err) return res.status(500).send(err);
    Event.countDocuments({organizationId:req.organization._id}, (err, count) => {
      if (err) return res.status(500).send(err);
      let response = {};
      response.totalPage = Math.ceil(count/5);
      response.events = events;
      return res.json(response);
    });
  });
});

module.exports = router;