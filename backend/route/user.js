const router = require('express').Router();
const User = require('../model/user.model');

router.get('/', (req, res) => {
  User.find({organizationId:req.organization._id}, req.fields).exec((err, users) => {
    if (err) return res.status(500).send(err);
    return res.json(users);
  });
});

module.exports = router;