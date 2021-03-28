const router = require('express').Router();
const Interview = require('../model/interview.model');

router.get('/', (req, res) => {
  let page = req.query.page;
  if(!page) page = 1;
  Interview.
    find({organizationId:req.organization._id}, req.fields)
    .skip((page-1)*10).limit(10)
    .populate({path:'position'})
    .populate({path:'interviewers'})
    .populate({path:'problems'})
    .exec((err, interviews) => {
    if (err) return res.status(500).send(err);
    Interview.countDocuments({organizationId:req.organization._id}, (err, count) => {
      if (err) return res.status(500).send(err);
      let response = {};
      response.totalPage = Math.ceil(count/10);
      response.interviews = interviews;
      return res.json(response);
    });
  });
});

module.exports = router;