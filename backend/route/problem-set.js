"use strict";
/*global escape: true */

const router = require('express').Router();
const express = require('express');
const problemSet = require('../model/problem-set.model').ProblemSet;
const crypto = require('crypto');
const cookie = require('cookie');
const session = require('express-session');
const Event = require('../model/event.model');
const isOrgUser = require('../access/isOrgUser');
const { body, query, param } = require('express-validator');
const handleValidationResult = require('../util/validation-result');

const Languages = [
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript"
];

const Limiter = 10;


// const problemSetSchema = new Schema({
//   belongingUserId: { String },
//   belongingOrgId: { String },
//   problemName:{ String },
//   description:{ String },
//   correctRate:{ Number },
//   preferredLanguage:{ String },
//   starterCodes:{ Array },
//   problemInputSet:{ Array },
//   problemOutputSet:{ Array },
//   problemRubric:{ Array }
// });

// Creation of a new problem
router.route('/').post(isOrgUser,
  [body('problemName', 'problem name is needed and should be non-empty string').isString().notEmpty().escape(), 
  body('description', 'problem description is needed and should be non-empty string').isString().notEmpty().escape()],
  handleValidationResult,
  (req, res) => {
  if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");

  // ID will be created at backend
  const { problemName, description, StarterCodes, problemInputSet, problemOutputSet, problemRubric } = req.body;
  problemSet.find({ belongingUserId: req.session.user._id }).count((err, docC) => {
    if (err) return res.status(500).send(err);
    // console.log(docC)
    if (docC > 999) return res.status(406).send("You have too many problems under this user! Please remove some.");

    problemSet.findOne({ problemName: problemName, belongingOrgId: req.organization._id }, (err, doc) => {
      if (err) return res.status(500).send(err);
      if (doc) return res.status(409).send("Problem with this name already exists");
      new problemSet({
        belongingUserId: req.session.user._id,
        belongingOrgId: req.organization._id,
        problemName: problemName,
        description: description,
        correctRate: 1,
        preferredLanguage: Languages[0],
        starterCodes: StarterCodes,
        problemInputSet: problemInputSet,
        problemOutputSet: problemOutputSet,
        problemRubric: problemRubric
      }).save((err, doc) => {
        if (err) return res.status(500).send(err);
        new Event({
          user: req.session.user._id,
          action: 'create',
          itemType: 'problem',
          item1: {name:doc.problemName, id:doc._id},
          time: new Date(),
          organizationId: req.organization._id,
        }).save(err => { if (err) { return res.status(500).send(err); } return res.status(200).send("Success"); });

      });
    });
  });
});

// Update of an existing problem
router.route('/').put(isOrgUser,
  [body('ID', 'problem ID is needed and should be non-empty string').isString().notEmpty().escape(), 
    body('problemName', 'problem name is needed and should be non-empty string').isString().notEmpty().escape(), 
  body('description', 'problem description is needed and should be non-empty string').isString().notEmpty().escape()],
  handleValidationResult,
  (req, res) => {
  if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");

  const { ID, problemName, description, StarterCodes, correctRate, preferredLanguage, problemInputSet, problemOutputSet, problemRubric } = req.body;
  problemSet.findOne({ _id: ID, belongingOrgId: req.organization._id }, function (err, doc) {
    if (err) { return res.status(500).send(err); }
    if (!doc) {
      return res.status(404).send("Given problem ID does not exist!");
    }
    else {
      var SaveName = doc.problemName;
      var SaveID = doc._id;
      problemSet.updateOne({ _id: ID, belongingOrgId: req.organization._id }, {
        belongingUserId: req.session.user._id,
        problemName: problemName == undefined ? doc.problemName : problemName,
        description: description == undefined ? doc.description : description,
        starterCodes: StarterCodes == undefined ? doc.starterCodes : StarterCodes,
        correctRate: correctRate == undefined ? doc.correctRate : correctRate,
        preferredLanguage: preferredLanguage == undefined ? doc.preferredLanguage : preferredLanguage,
        problemInputSet: problemInputSet == undefined ? doc.problemInputSet : problemInputSet,
        problemOutputSet: problemOutputSet == undefined ? doc.problemOutputSet : problemOutputSet,
        problemRubric: problemRubric == undefined ? doc.problemRubric : problemRubric,
      }, function (err, docU) {
        if (err) return res.status(500).send(err);
        new Event({
          user: req.session.user._id,
          action: 'update',
          itemType: 'problem',
          item1: {name:SaveName, id:SaveID},
          time: new Date(),
          organizationId: req.organization._id,
        }).save(err => { if (err) { return res.status(500).send(err); } return res.status(200).send("Success"); });
      });
    }
  });
});


function BatchRecursive(subset, req, res) {
  // console.log(subset.length);
  if (subset.length == 0) {
    // console.log("Successfully updated batch!");
    return res.status(200).send("Successfully updated batch!");
  }
  else {
    var singleProblem = subset[0];
    problemSet.findOne({ _id: singleProblem.ID, belongingOrgId: req.organization._id }, function (err, doc) {
      if (err) { console.log(`${err}`); return res.status(500).send(err); }
      if (doc) {
        problemSet.updateOne({ _id: singleProblem.ID, belongingOrgId: req.organization._id }, {
          correctRate: singleProblem.correctRate == undefined ? doc.correctRate : singleProblem.correctRate,
          problemName: singleProblem.problemName == undefined ? doc.problemName : singleProblem.problemName,
          description: singleProblem.description == undefined ? doc.description : singleProblem.description,
          starterCodes: singleProblem.StarterCodes == undefined ? doc.starterCodes : singleProblem.StarterCodes,
          preferredLanguage: singleProblem.preferredLanguage == undefined ? doc.preferredLanguage : singleProblem.preferredLanguage,
          problemInputSet: singleProblem.problemInputSet == undefined ? doc.problemInputSet : singleProblem.problemInputSet,
          problemOutputSet: singleProblem.problemOutputSet == undefined ? doc.problemOutputSet : singleProblem.problemOutputSet,
          problemRubric: singleProblem.problemRubric == undefined ? doc.problemRubric : singleProblem.problemRubric,
        }, function (errr, docU) {
          if (errr) { console.log(`${errr}`); return res.status(500).send(errr); }
          return BatchRecursive(subset.slice(1), req, res);
        });
      }
      else {
        return BatchRecursive(subset.slice(1), req, res);
      }
    });
  }
}

// Update of multiple existing problem
router.route('/').patch(isOrgUser,
  [body('toBeUpdated', 'toBeUpdated problem list is needed').notEmpty(),],
handleValidationResult,
  (req, res) => {
  if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");

  const { toBeUpdated } = req.body;
  var toBeUpdatedList;
  try {
    toBeUpdatedList = JSON.parse(toBeUpdated);
  }
  catch (e) {
    return res.status(400).send(e);
  }

  return BatchRecursive(toBeUpdatedList, req, res);
});

// Delete of an existing problem
router.route('/:problemID').delete(isOrgUser,
  [param('problemID', 'problem ID is neededand should be non-empty string').isString().notEmpty().escape(),],
handleValidationResult,
  (req, res) => {
  if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");
  const ID = req.params.problemID;

  problemSet.findOne({ _id: ID }, function (err, doc) {
    if (err) { return res.status(500).send(err); }
    if (!doc) {
      return res.status(202).send("This problem ID does not exist.");
    }
    else {
      var SaveName = doc.problemName;
      var SaveID = doc._id;
      problemSet.deleteOne({ _id: doc._id }, (err, docR) => {
        if (err) return res.status(500).send(err);
        new Event({
          user: req.session.user._id,
          action: 'delete',
          itemType: 'problem',
          item1: {name:SaveName, id:SaveID},
          time: new Date(),
          organizationId: req.organization._id,
        }).save(err => { if (err) { return res.status(500).send(err); } return res.status(200).send("Deletion Success"); });
      });
    }
  });
});

// Get problems
router.route('/').get(isOrgUser, (req, res) => {
  // if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");

  var PageNum = req.query.pageNum;
  var ContextQuery = req.query.Q == undefined?"":req.query.Q;
  if (PageNum == undefined || PageNum == -1) {
    // If page was not designated
    problemSet.find({ belongingOrgId: req.organization._id }, function (err, doc) {
      if (err) {console.log(err); return res.status(500).send(err);}
      if (!doc) {
        return res.status(404).send("User's problem set does not exist!");
      }
      else {
        var DocNew = [];
        var re = new RegExp(ContextQuery);
        doc.forEach(element => {
          if(re.test(element._id) || re.test(element.problemName) || re.test(element.description)){
            DocNew.push(element);
          }
        });
        return res.json(DocNew);
        // return res.json(doc);
      }
    });
  }
  else {
    // If page was designated
    problemSet.find({ belongingOrgId: req.organization._id }).skip((PageNum-1) * Limiter).limit(Limiter).exec((err, doc) => {
      if (err) {console.log(err); return res.status(500).send(err);}
      if (!doc) {
        return res.status(404).send("User's problem set does not exist!");
      }
      else {
        var DocNew = [];
        var re = new RegExp(ContextQuery);
        doc.forEach(element => {
          if(re.test(element._id) || re.test(element.problemName) || re.test(element.description)){
            DocNew.push(element);
          }
        });
        return res.json(DocNew);
        // return res.json(doc);
      }
    });
  }
});
// Get Page count
router.route('/pageCount').get(isOrgUser, (req, res) => {
  problemSet.count({ belongingOrgId: req.organization._id }, (err, Kount) => {
    if (err) return res.status(500).send(err);
    if (Kount == null) return res.status(404).send("User's problem set does not exist!");
    else return res.json({count:Kount/Limiter});
  });
});


router.route('/:pid').get(
  [param('pid', 'problem ID is neededand should be non-empty string').isString().notEmpty().escape(),],
handleValidationResult,
  (req, res) => {
  problemSet.findOne({ _id: req.params.pid }, (err, doc) => {
    if (err) return res.status(500).send(err);
    if (doc == null) return res.status(404).send("Problem set does not exist!");
    else return res.json(doc);
  });
});

router.route('/:pid/dataset').get(isOrgUser,
  [param('pid', 'problem ID is neededand should be non-empty string').isString().notEmpty().escape(),],
handleValidationResult,
  (req, res) => {
  problemSet.findOne({ _id: req.params.pid }, (err, doc) => {
    if (err) return res.status(500).send(err);
    if (doc == null) return res.status(404).send("User's problem set does not exist!");
    else return res.json({ Input: doc.problemInputSet, Output: doc.problemOutputSet });
  });
});

module.exports = router;