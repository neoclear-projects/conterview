const router = require('express').Router();
const Interview = require('../model/interview.model');
const Position = require('../model/position.model');
const async = require('async');

router.get('/', (req, res) => {
  Interview.find({}, req.fields).lean().exec(async (err, interviews) => {
    if (err) return res.status(500).send(err);
    await async.eachSeries(interviews, async (interview) => {
      await Position.findOne({_id:interview.positionId}).exec().then(position => interview.positionName = position.name);
    });
    return res.json(interviews);
  });
});

module.exports = router;