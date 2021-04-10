const router = require('express').Router();
const Event = require('../model/event.model');
const isOrgUser = require('../access/isOrgUser');
const { query } = require('express-validator');
const handleValidationResult = require('../util/validation-result');

router.get('/', isOrgUser, 
  [query('page', 'page should be non-negative integer').isInt({min:1})],
  handleValidationResult,
  (req, res) => {
  let page = req.query.page;
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