const router = require('express').Router();
const Interview = require('../model/interview.model');

router.get('/', (req, res) => {
  Interview.find({organizationId:req.organization._id}, req.fields).exec((err, interviews) => {
    if (err) return res.status(500).send(err);
    return res.json(interviews);
  });
});

module.exports = router;