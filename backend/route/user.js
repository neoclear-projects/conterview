const router = require('express').Router();
const User = require('../model/user.model');
const multer  = require('multer');
var upload = multer({ dest: '../uploads/' })

router.get('/', (req, res) => {
  User.find({organizationId:req.organization._id}, req.fields).exec((err, users) => {
    if (err) return res.status(500).send(err);
    return res.json(users);
  });
});

router.use('/:userId', (req, res, next) => {
  User.find({_id:req.params.userId}).exec((err, user) => {
    if (err) return res.status(500).send(err);
    if (!user || !req.organization._id.equals(user.organizationId)) return res.status(404).send("user #" + req.params.userId + " not found for organization #" + req.organization._id);
    req.user = user;
    next();
  });
});

router.patch('/:userId', (req, res) => {
  User.findOneAndUpdate({_id:req.user._id}, { $set: req.body }, { returnOriginal: false }, (err, user) => {
    if (err) return res.status(500).send(err);
    return res.json(user);
  });
});

router.patch('/:userId/avatar', upload.single('avatar'), (req, res) => {
  User.findOneAndUpdate({_id:req.user._id}, { $set: {avatar: req.file} }, { returnOriginal: false }, (err, user) => {
    if (err) return res.status(500).send(err);
    return res.json(user);
  });
});

module.exports = router;