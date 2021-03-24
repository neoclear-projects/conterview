const router = require('express').Router();
const express = require('express');
const problemSet = require('../model/problemSet.model');
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

var OperationLock = {

}

function DealWithOperationLock(_id, method, path, lockUp = true) {
  if (OperationLock[_id]) {
    while (OperationLock[_id][0]) {
      // setTimeout(function (e) {
      // }, 10);
      // console.log(`Waiting for ${OperationLock[_id]}`);
    }
  }
//   OperationLock[_id] = [lockUp, `${method} ON ${path}`];
//   console.log(`${OperationLock[_id][1]} Assigned ${lockUp} on me`);
}

function ReleaseOperationLock(_id, method, path) {
  OperationLock[_id] = [false, `${method} ON ${path}`];
  // console.log("RELEASING!");
}

var SingleProblemStorage = (function () {
  return function item(NewName, NewDescription, newCorrectRate, newPreferredLanguage, newID, newStarterCodes) {
    this.problemName = (NewName);
    this.description = (NewDescription);
    this.correctRate = newCorrectRate;
    this.preferredLanguage = newPreferredLanguage;
    this.ID = newID;
    this.starterCodes = newStarterCodes;
  };
}());

// Creation of a new problem
router.route('/').post((req, res) => {
  if ((!req.session.user) || (!req.session.user._id)) return res.status(403).end("Not Logged in!");

  // ID will be created at backend
  const { problemName, description, StarterCodes } = req.body;
  let newProblem = new SingleProblemStorage(problemName, description, 100, [Languages[0],], crypto.randomBytes(64).toString('base64'), StarterCodes);
  DealWithOperationLock(req.session.user._id, req.method, req.path);
  problemSet.findOne({ belongingUserId: req.session.user._id }, function (err, doc) {
    if (err) { ReleaseOperationLock(req.session.user._id, req.method, req.path); return res.status(500).end(err); }
    if (!doc) {
      new problemSet({
        belongingUserId: req.session.user._id,
        problems: [newProblem,]
      })
        .save((err, doc) => {
          ReleaseOperationLock(req.session.user._id, req.method, req.path);
          if (err) return res.status(500).end(err);
          return res.status(200).json("Success");
        });
    }
    else {
      // let a = ["a", "b"];
      // newProblem.ID = doc.problems.length;
      doc.problems.push(newProblem);
      CombinedProblems = doc.problems;
      problemSet.updateOne({ belongingUserId: req.session.user._id }, { belongingUserId: req.session.user._id, problems: CombinedProblems }, function (err, docU) {
        ReleaseOperationLock(req.session.user._id, req.method, req.path);
        if (err) return res.status(500).end(err);
        return res.status(200).json(doc.problems);
      })
    }
  });
});

// Update of an existing problem
router.route('/update').post((req, res) => {
  if ((!req.session.user) || (!req.session.user._id)) return res.status(403).end("Not Logged in!");

  const { ID, problemName, description, StarterCodes, correctRate, preferredLanguage } = req.body;
  var newCorrectRate = correctRate;
  var newPreferredLanguage = preferredLanguage;
  DealWithOperationLock(req.session.user._id, req.method, req.path);
  problemSet.findOne({ belongingUserId: req.session.user._id }, function (err, doc) {
    if (err) { ReleaseOperationLock(req.session.user._id, req.method, req.path); return res.status(500).end(err); }
    if (!doc) {
      ReleaseOperationLock(req.session.user._id, req.method, req.path);
      return res.status(404).end("User's problem set does not exist!")
    }
    else {
      // We do update by replacing the problem that has same ID with a new singleProblem instance.
      CombinedProblems = [];
      doc.problems.forEach(singleProblem => {
        if (singleProblem.ID == ID) {
          // These two checks are for the consideration of actually updating them after interviewee finished tests.
          if (correctRate == undefined) { newCorrectRate = singleProblem.correctRate; }
          if (preferredLanguage == undefined) { newPreferredLanguage = singleProblem.preferredLanguage; }
          CombinedProblems.push(
            new SingleProblemStorage(
              problemName,
              description,
              newCorrectRate,
              newPreferredLanguage,
              ID,
              StarterCodes
            ));
        }
        else {
          CombinedProblems.push(singleProblem);
        }
      });
      problemSet.updateOne({ belongingUserId: req.session.user._id }, { belongingUserId: req.session.user._id, problems: CombinedProblems }, function (err, docU) {
        ReleaseOperationLock(req.session.user._id, req.method, req.path);
        if (err) return res.status(500).end(err);
        return res.status(200).end("Success");
      })
    }
  });
});

// Update of multiple existing problem
router.route('/updateBatch').post((req, res) => {
  if ((!req.session.user) || (!req.session.user._id)) return res.status(403).end("Not Logged in!");

  const { toBeUpdated } = req.body;
  const toBeUpdatedList = JSON.parse(toBeUpdated);
  batch = [];
  toBeUpdatedList.forEach(singleProblem => {
    var newCorrectRate = singleProblem.correctRate;
    var newPreferredLanguage = singleProblem.preferredLanguage;
    if (singleProblem.correctRate == undefined) { newCorrectRate = singleProblem.correctRate; }
    if (singleProblem.preferredLanguage == undefined) { newPreferredLanguage = singleProblem.preferredLanguage; }
    batch.push(
      new SingleProblemStorage(
        singleProblem.problemName,
        singleProblem.description,
        newCorrectRate,
        newPreferredLanguage,
        singleProblem.ID,
        singleProblem.StarterCodes
      ));
  });
  // DealWithOperationLock(req.session.user._id, req.method, req.path);
  problemSet.findOne({ belongingUserId: req.session.user._id }, function (err, doc) {
    if (err) { ReleaseOperationLock(req.session.user._id, req.method, req.path); return res.status(500).end(err); }
    if (!doc) {
      ReleaseOperationLock(req.session.user._id, req.method, req.path);
      return res.status(404).end("User's problem set does not exist!")
    }
    else {
      // We do update by replacing the problem that has same ID with a new singleProblem instance.
      CombinedProblems = [];
      // Double loop
      doc.problems.forEach(singleProblem => {
        singleProblemTemp = singleProblem;
        // batch.forEach(newSP => {
        for (i = 0; i < batch.length; i++) {
          var newSP = batch[i];
          if (singleProblemTemp.ID == newSP.ID) {
            singleProblemTemp = newSP;
            break;
          }
        };
        CombinedProblems.push(singleProblemTemp);
      });
      problemSet.updateOne({ belongingUserId: req.session.user._id }, { belongingUserId: req.session.user._id, problems: CombinedProblems }, function (err, docU) {
        ReleaseOperationLock(req.session.user._id, req.method, req.path);
        if (err) return res.status(500).end(err);
        return res.status(200).end("Success!");
      })
    }
  });
});

// Delete of an existing problem
router.route('/delete').post((req, res) => {
  if ((!req.session.user) || (!req.session.user._id)) return res.status(403).end("Not Logged in!");
  const { ID } = req.body;
  DealWithOperationLock(req.session.user._id, req.method, req.path);
  console.log("DELETEStarted");
  problemSet.findOne({ belongingUserId: req.session.user._id }, function (err, doc) {
    if (err) { ReleaseOperationLock(req.session.user._id, req.method, req.path); return res.status(500).end(err); }
    if (!doc) {
      ReleaseOperationLock(req.session.user._id, req.method, req.path);
      return res.status(404).end("User's problem set does not exist!")
    }
    else {
      // We do update by replacing the problem that has same ID with a new singleProblem instance.
      CombinedProblems = [];
      doc.problems.forEach(singleProblem => {
        if (singleProblem.ID === ID) {
          // Simply do Nothing
        }
        else {
          CombinedProblems.push(singleProblem);
        }
      });
      problemSet.updateOne({ belongingUserId: req.session.user._id }, { belongingUserId: req.session.user._id, problems: CombinedProblems }, function (err, docU) {
        ReleaseOperationLock(req.session.user._id, req.method, req.path);
        if (err) return res.status(500).end(err);
        console.log("DELETECOMPLETED");
        return res.status(200).end("Success");
      })
    }
  });
});


// Get problems
router.route('/').get((req, res) => {
  if ((!req.session.user) || (!req.session.user._id)) return res.status(403).end("Not Logged in!");

  DealWithOperationLock(req.session.user._id, req.method, req.path, false);
  problemSet.findOne({ belongingUserId: req.session.user._id }, function (err, doc) {
    if (err) return res.status(500).end(err);
    if (!doc) {
      return res.status(404).end("User's problem set does not exist!")
    }
    else {
      return res.json(doc.problems);
    }
  });
});

module.exports = router;