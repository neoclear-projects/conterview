const router = require('express').Router();
const User = require('../model/user.model');
const multer  = require('multer');
const path  = require('path');
const isOrgUser = require('../access/isOrgUser');
const ObjectId = require('mongoose').Types.ObjectId;
const { body, param } = require('express-validator');
const handleValidationResult = require('../util/validation-result');

router.get('/', isOrgUser, (req, res) => {
  User.find({organizationId:req.organization._id}, req.fields).exec((err, users) => {
    if (err) return res.status(500).send(err);
    return res.json(users);
  });
});

router.use('/:userId', 
  [param('userId', 'id invalid: user').custom((value) => {return ObjectId.isValid(value)})],
  handleValidationResult,
  (req, res, next) => {
  if(!ObjectId.isValid(req.params.userId)) return res.status(400).send('id invalid: user');
  User.findOne({_id:req.params.userId}).exec((err, user) => {
    if (err) return res.status(500).send(err);
    if (!user || !req.organization._id.equals(user.organizationId)) return res.status(404).send("user #" + req.params.userId + " not found for organization #" + req.organization._id);
    req.user = user;
    next();
  });
});

router.get('/:userId', isOrgUser, (req, res) => {
  User.findOne({_id:req.user._id}).exec((err, user) => {
    if (err) return res.status(500).send(err);
    return res.json(user);
  });
});

router.get('/:userId/avatar', isOrgUser, (req, res) => {
  User.findOne({_id:req.user._id}).exec((err, user) => {
    if (err) return res.status(500).send(err);
    let avatar = user.avatar;
    if(!avatar) return res.status(404).send('avatar of user #' + req.params.userId + ' does not exist');
    res.setHeader('Content-Type', avatar.mimetype);
    console.log(path.join(__dirname, '..', avatar.path));
    return res.sendFile(path.join(__dirname, '..', avatar.path));
  });
});

router.patch('/:userId', isOrgUser,
  [body('username', 'username should be non-empty string').optional().isString().notEmpty().escape(), 
  body('email', 'email should be email formatted').optional().isEmail(),
  body('department', 'department should be valid string').optional().isString().escape(),
  body('title', 'title should be valid string').optional().isString().escape(),
  body('personalStatement', 'personalStatement should be valid string').optional().isString().escape()],
  handleValidationResult, 
  (req, res) => {
  const { username, email, department, title, personalStatement } = req.body;
  User.findOneAndUpdate({_id:req.user._id}, { $set: { username, email, department, title, personalStatement } }, { returnOriginal: false }, (err, user) => {
    if (err) return res.status(500).send(err);
    return res.json(user);
  });
});

router.patch('/:userId/avatar', isOrgUser, multer({ dest: 'uploads/avatar' }).single('avatar'), (req, res) => {
  User.findOneAndUpdate({_id:req.user._id}, { $set: {avatar: req.file} }, { returnOriginal: false }, (err, user) => {
    if (err) return res.status(500).send(err);
    return res.json(user);
  });
});

module.exports = router;