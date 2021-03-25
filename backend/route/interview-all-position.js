const router = require('express').Router();
const Interview = require('../model/interview.model');
const Position = require('../model/position.model');
const async = require('async');

router.get('/', (req, res) => {
  Interview.find({organizationId:req.organization._id}, req.fields).lean().exec((err, interviews) => {
    if (err) return res.status(500).send(err);
    return res.json(interviews);
  });
});

module.exports = router;