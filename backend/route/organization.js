const router = require('express').Router();
const Organization = require('../model/organization.model');
const crypto = require('crypto');
const ObjectId = require('mongoose').Types.ObjectId;
const { body, param } = require('express-validator');
const handleValidationResult = require('../util/validation-result');

router.post('/', 
  [body('name', 'organization name is needed and should be non-empty string').isString().notEmpty().escape(), 
  body('passcode', 'organization passcode is needed and should be non-empty string').isString().notEmpty().escape()],
  handleValidationResult,
  (req, res) => {
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
      const { _id, name } = organization;
      return res.json({ _id, name });
    });
  });
});

router.use('/:organizationId', 
  [param('organizationId', 'id invalid: organization').custom((value) => {return ObjectId.isValid(value)})],
  handleValidationResult,
  (req, res, next) => {
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