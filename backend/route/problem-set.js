const router = require('express').Router();
const express = require('express');
const problemSet = require('../model/problem-set.model');
const crypto = require('crypto');
const cookie = require('cookie');
const session = require('express-session');

const Languages = [
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript"
]

// var SingleProblemStorage = (function () {
//   return function item(NewName, NewDescription, newCorrectRate, newPreferredLanguage, newID, newStarterCodes, newInputSet, newOutputSet) {
//     this.problemName = (NewName);
//     this.description = (NewDescription);
//     this.correctRate = newCorrectRate;
//     this.preferredLanguage = newPreferredLanguage;
//     this.ID = newID;
//     this.starterCodes = newStarterCodes;
//     this.InputSet = newInputSet;
//     this.newOutputSet = newOutputSet;
//   };
// }());

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
router.route('/').post((req, res) => {
  // if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");

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
        return res.json(doc);
      });
    });
  });
});

// Update of an existing problem
router.route('/').put((req, res) => {
  // if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");

  const { ID, problemName, description, StarterCodes, correctRate, preferredLanguage, problemInputSet, problemOutputSet, problemRubric } = req.body;
  problemSet.findOne({ _id: ID, belongingOrgId: req.organization._id }, function (err, doc) {
    if (err) { return res.status(500).send(err); }
    if (!doc) {
      return res.status(404).send("Given problem ID does not exist!")
    }
    else {
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
        return res.status(200).send("Success");
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
    singleProblem = subset[0];
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
      else{
        return BatchRecursive(subset.slice(1), req, res);
      }
    });
  }
}

// Update of multiple existing problem
router.route('/').patch((req, res) => {
  // if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");

  const { toBeUpdated } = req.body;
  var toBeUpdatedList;
  try {
    toBeUpdatedList = JSON.parse(toBeUpdated);
  }
  catch (e) {
    console.log(`${e}`);
    return res.status(400).send(e);
  }

  return BatchRecursive(toBeUpdatedList, req, res);
});

// Delete of an existing problem
router.route('/:problemID').delete((req, res) => {
  // if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");
  const ID = req.params.problemID;
  // console.log(ID);
  problemSet.findOne({ _id: ID, belongingUserId: req.session.user._id, belongingOrgId: req.organization._id }, function (err, doc) {
    if (err) { return res.status(500).send(err); }
    if (!doc) {
      return res.status(202).send("This problem ID does not exist.")
    }
    else {
      problemSet.deleteOne({ _id: doc._id }, (err, docR) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send("Success!");
      });
    }
  });
});

// Get problems
router.route('/').get((req, res) => {
  // if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");

  problemSet.find({ belongingOrgId: req.organization._id }, function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) {
      return res.status(404).send("User's problem set does not exist!")
    }
    else {
      return res.json(doc);
    }
  });
});

// Get problems with specific ID
router.route('/:problemID').get((req, res) => {
  // if ((!req.session.user) || (!req.session.user._id)) return res.status(403).send("Not Logged in!");

  problemSet.findOne({ _id: req.params.problemID }, function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) {
      return res.status(404).send("User's problem set does not exist!")
    }
    else {
      return res.json(doc);
    }
  });
});

router.route('/:pid').get((req, res) => {
  problemSet.findOne({ _id: req.params.pid }, (err, doc) => {
    if (err) return res.status(500).send(err);
    if (doc == null) return res.status(404).send("User's problem set does not exist!");
    else return res.json(doc);
  });
});

module.exports = router;