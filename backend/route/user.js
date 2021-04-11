"use strict";

const router = require('express').Router();
const User = require('../model/user.model');
const multer  = require('multer');
const path  = require('path');
const isOrgUser = require('../access/isOrgUser');
const ObjectId = require('mongoose').Types.ObjectId;
const { body, param, query } = require('express-validator');
const handleValidationResult = require('../util/validation-result');

router.get('/', isOrgUser, 
  [query('page', 'page should be non-negative integer').optional().isInt({min:1}),
  query('usernameContains', 'usernameContains should be non-empty string').isString().notEmpty().escape()],
  handleValidationResult,
  (req, res) => {
  let { page, usernameContains } = req.query;
  let query = {organizationId:req.organization._id};
  if(usernameContains) query.username = { "$regex": usernameContains, "$options": "i" };
  if(!page) page = 1;
  User
    .find(query, 'username')
    .skip((page-1)*10).limit(10)
    .exec((err, users) => {
    if (err) return res.status(500).send(err);
    return res.json(users);
  });
});

router.use('/:userId', 
  [param('userId', 'id invalid: user').custom((value) => {return ObjectId.isValid(value);})],
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
  User.findOne({_id:req.user._id}, 'username email department title personalStatement').exec((err, user) => {
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
    const { _id, username, email, department, title, personalStatement } = user;
    return res.json({ _id, username, email, department, title, personalStatement });
  });
});

router.put('/:userId/avatar', isOrgUser, multer({ dest: 'uploads/avatar' }).single('avatar'), (req, res) => {
  User.findOneAndUpdate({_id:req.user._id}, { $set: {avatar: req.file} }, { returnOriginal: false }, (err) => {
    if (err) return res.status(500).send(err);
    return res.send('avatar changed successfully');
  });
});

module.exports = router;