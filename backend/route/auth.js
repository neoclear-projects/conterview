const router = require('express').Router();
const User = require('../model/user.model');
const Interview = require('../model/interview.model');
const Organization = require('../model/organization.model');
const crypto = require('crypto');

router.route('/login').post((req, res) => {
  const { username, password } = req.body;
  User.findOne({username}).lean().exec(function(err, user){
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send("access denied");

    let hash = crypto.createHmac('sha512', user.salt);
    hash.update(password);
    let saltedHash = hash.digest('base64');

    if (user.saltedHash !== saltedHash) return res.status(401).send("access denied");
    // start a session
    user.type = 'orgUser';
    req.session.user = user;
    return res.json(user);
  });
});

router.route('/logout').get((req, res) => {
  req.session.destroy();
  return res.json("user " + req.username + " signed out");
});

router.route('/register').post((req, res) => {
  const { organization, passcode, username, password, email } = req.body;
  Organization.findOne({name:organization}, function(err, org){
    if (err) return res.status(500).send(err);
    if (!org) return res.status(404).send("organization " + organization + " does not exist");

    let passcodeHash = crypto.createHmac('sha512', org.salt);
    passcodeHash.update(passcode);
    let passcodeSaltedHash = passcodeHash.digest('base64');
    if(org.saltedHash !== passcodeSaltedHash) return res.status(401).send("wrong passcode");

    User.findOne({username}, function(err, user){
      if (err) return res.status(500).send(err);
      if (user) return res.status(409).send("username " + username + " already exists");

      let salt = crypto.randomBytes(16).toString('base64');
      let hash = crypto.createHmac('sha512', salt);
      hash.update(password);
      let saltedHash = hash.digest('base64');

      new User({username, saltedHash, salt, email, organizationId: org._id}).save((err, user) => {
        if(err) return res.status(500).send(err);
        // start a session
        req.session.user = user;
        return res.json(user);
      });
    });
  });
});

router.route('/candidate-login').post((req, res) => {
  const { interviewId, passcode } = req.body;
  Interview.findOne({_id:interviewId}, function(err, interview){
    if (err) return res.status(500).send(err);
    if (!interview) return res.status(401).send("access denied");

    let hash = crypto.createHmac('sha512', interview.salt);
    hash.update(passcode);
    let saltedHash = hash.digest('base64');

    if (interview.saltedHash !== saltedHash) return res.status(401).send("access denied");
    // start a session
    req.session.user = {interviewId, type:'candidate'};
    return res.json({interviewId, organizationId: interview.organizationId});
  });
});

module.exports = router;
