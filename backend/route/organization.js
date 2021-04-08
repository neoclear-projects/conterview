const router = require('express').Router();
const Organization = require('../model/organization.model');
const crypto = require('crypto');
const ObjectId = require('mongoose').Types.ObjectId;

router.post('/', (req, res) => {
  const { name, passcode } = req.body;

  Organization.findOne({name}, function(err, organization){
    if (err) return res.status(500).send(err);
    if (organization) return res.status(409).send("organization " + name + " already exists");

    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt);
    hash.update(passcode);
    let saltedHash = hash.digest('base64');

    new Organization({name, salt, saltedHash}).save((err, organization) => {
      if(err) return res.status(500).send(err);
      return res.json(organization);
    });
  });
});

router.use('/:organizationId', (req, res, next) => {
  if(!ObjectId.isValid(req.params.organizationId)) return res.status(400).send('id invalid: organization');
  Organization.findOne({_id:req.params.organizationId}, function(err, organization){
    if (err) return res.status(500).send(err);
    if (!organization) return res.status(404).send("organization #" + req.params.organizationId + " does not exist");
    req.organization = organization;
    next();
  });
});

const position = require('./position');
const user = require('./user');
const problemSet = require('./problem-set');
const interview = require('./interview-all-position');
const event = require('./event');

router.use('/:organizationId/position', position);
router.use('/:organizationId/user', user);
router.use('/:organizationId/problemSet', problemSet);
router.use('/:organizationId/interview', interview);
router.use('/:organizationId/event', event);

module.exports = router;