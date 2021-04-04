const router = require('express').Router();
const User = require('../model/user.model');
const Organization = require('../model/organization.model');
const crypto = require('crypto');
const cookie = require('cookie');

router.route('/login').post((req, res) => {
  const { username, password } = req.body;
  User.findOne({username}, function(err, user){
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send("access denied");

    let hash = crypto.createHmac('sha512', user.salt);
    hash.update(password);
    let saltedHash = hash.digest('base64');

    if (user.saltedHash !== saltedHash) return res.status(401).send("access denied");
    // start a session
    req.session.user = user;
    return res.json(user);
  });
});

router.route('/logout').get((req, res) => {
  req.session.destroy();
  return res.json("user " + req.username + " signed out");
});

router.route('/register').post((req, res) => {
  const { organization, username, password, email } = req.body;
  Organization.findOne({name:organization}, function(err, org){
    if (err) return res.status(500).send(err);
    if (!org) return res.status(404).send("organization " + organization + " does not exist");
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

module.exports = router;
