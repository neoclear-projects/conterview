"use strict";

const router = require('express').Router();
const User = require('../model/user.model');
const Interview = require('../model/interview.model');
const Organization = require('../model/organization.model');
const crypto = require('crypto');
const { body } = require('express-validator');
const handleValidationResult = require('../util/validation-result');
const ObjectId = require('mongoose').Types.ObjectId;

router.route('/login').post(
  [body('username', 'username should be non-empty string').isString().notEmpty().escape(), 
  body('password', 'password should be non-empty string').isString().notEmpty().escape()],
  handleValidationResult,
  (req, res) => {
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
    const { _id, username, organizationId } = user;
    return res.json({ _id, username, organizationId });
  });
});

router.route('/logout').get((req, res) => {
  req.session.destroy();
  return res.json("user " + req.username + " signed out");
});

router.route('/register').post(
  [body('organization', 'organization is needed and should be non-empty string').isString().notEmpty().escape(),
  body('passcode', 'passcode is needed and should be non-empty string').isString().notEmpty().escape(),
  body('username', 'username is needed and should be non-empty string').isString().notEmpty().escape(), 
  body('password', 'password is needed and should be non-empty string').isString().notEmpty().escape(),
  body('email', 'email is needed and should be email formatted').isEmail()],
  handleValidationResult,
  (req, res) => {
  const { organization, passcode, username, password, email } = req.body;
  Organization.findOne({name:organization}, function(err, org){
    if (err) return res.status(500).send(err);
    if (!org) return res.status(404).send("organization does not exist");

    let passcodeHash = crypto.createHmac('sha512', org.salt);
    passcodeHash.update(passcode);
    let passcodeSaltedHash = passcodeHash.digest('base64');
    if(org.saltedHash !== passcodeSaltedHash) return res.status(401).send("wrong passcode");

    User.findOne({username}, function(err, user){
      if (err) return res.status(500).send(err);
      if (user) return res.status(409).send("username already exists");
      User.findOne({email}, function(err, user){
        if (err) return res.status(500).send(err);
        if (user) return res.status(409).send("email has been registered");
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        let saltedHash = hash.digest('base64');

        new User({username, saltedHash, salt, email, organizationId: org._id}).save((err, user) => {
          console.log(err);
          if(err) return res.status(500).send(err);
          // start a session
          const { _id, username, organizationId } = user;
          req.session.user = { _id, username, organizationId, type:'orgUser' };
          return res.json({ _id, username, organizationId });
        });
      });
    });
  });
});

router.route('/candidate-login').post(
  [body('interviewId', 'id invalid: interview').custom((value) => {return ObjectId.isValid(value);}),
  body('passcode', 'passcode is needed and should be non-empty string').isString().notEmpty()],
  handleValidationResult,
  (req, res) => {
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
