const router = require('express').Router();
const Organization = require('../model/organization.model');

router.post('/', (req, res) => {
  const { name } = req.body;

  Organization.findOne({name}, function(err, organization){
    if (err) return res.status(500).send(err);
    if (organization) return res.status(409).send("organization " + name + " already exists");

    new Organization({name}).save((err, organization) => {
      if(err) return res.status(500).send(err);
      return res.json(organization);
    });
  });
});

router.use('/:organizationId', (req, res, next) => {
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