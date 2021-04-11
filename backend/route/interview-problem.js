"use strict";

const router = require('express').Router();
const { body, param } = require('express-validator');
const handleValidationResult = require('../util/validation-result');

const pythonRunner = require('../exec/python-runner');
const cppRunner = require('../exec/cpp-runner');
const javaRunner = require('../exec/java-runner');
const javascriptRunner = require('../exec/javascript-runner');
const typescriptRunner = require('../exec/typescript-runner');

const isInterviewerOrCandidate = require('../access/isInterviewerOrCandidate');
const isInterviewer = require('../access/isInterviewer');

router.use('/:index', 
  [param('index', 'index should be non-negative integer').isInt({min:0})],
  handleValidationResult,
  (req, res, next) => {
  const interview = req.interview;
  const index = req.params.index;
  if (index >= interview.problemsSnapshot.length || index < 0) return res.status(404).send('problem index out of bound');
  req.interviewProblem = interview.problemsSnapshot[index];
  next();
});

router.patch('/:index/evaluation', isInterviewer,
  [body('grade', 'grade should contain idx and value').optional().custom(value => {return value.idx !== undefined && value.value !== undefined;}),
  body('grade.idx', 'grade.idx should be non-negative integer').optional().isInt({min:0}),
  body('grade.value', 'grade.value should be non-negative integer').optional().isInt({min:0}),
  body('comment', 'comment should be valid string').optional().isString().escape(),
  body('allPassed', 'allPassed should be true').optional().custom(value => {return value == true;})],
  handleValidationResult,
  (req, res) => {
  const interview = req.interview;
  const { grade, comment, allPassed } = req.body;
  if (grade) {
    const { idx, value } = grade;
    if (idx >= interview.problemsSnapshot[req.params.index].problemRubric.length || idx < 0) return res.status(404).send('rubric index out of bound');
    interview.problemsSnapshot[req.params.index].problemRubric[idx].curRating = value;
  }
  if (comment) {
    interview.problemsSnapshot[req.params.index].comment = comment;
  }
  if (allPassed) {
    interview.problemsSnapshot[req.params.index].allPassed = allPassed;
  }
  interview.save((err, interview) => {
    if (err) return res.status(500).send(err);
    const { problemRubric, allPassed } = interview.problemsSnapshot[req.params.index];
    return res.json({ problemRubric, allPassed });
  });
});

const executor = {
  'python': pythonRunner,
  'cpp': cppRunner,
  'java': javaRunner,
  'javascript': javascriptRunner,
  'typescript': typescriptRunner
};

router.route('/:index/run').post(isInterviewerOrCandidate, (req, res) => {
  const { language, code } = req.body;
  const interviewId = req.interview._id.toString();

  let runner = executor[language];
  
  // Return if no corresponding language
  if (runner === undefined) {
    return res.status(404).send('Language not found');
  }

  runner('code', interviewId, null, code, (stdout, stderr) => res.json({"output": stdout + stderr }));
});

function outputComparator(expected, actual) {
  return expected === actual;
}

router.route('/:index/test').post(isInterviewerOrCandidate, (req, res) => {
  const { language, code } = req.body;
  const interview = req.interview;
  const interviewId = req.interview._id.toString();
  const dat = req.interviewProblem;

  if (dat == null) return res.status(404).send('problem does not exist');

  const inputArray = dat.problemInputSet;
  const outputArray = dat.problemOutputSet;

  if (inputArray.length != outputArray.length) return res.status(500).send('Data inconsistent');

  // Start comparing

  let runner = executor[language];
  if (runner === undefined) return res.status(404).send('Language not found');

  const promisedRunner = (input, output) => {
    return new Promise((resolve, reject) => {
      runner('code', interviewId, input, code, (stdout, stderr) => {
        if (stderr && stderr != '') return reject(stderr);

        if (outputComparator(output, stdout)) return resolve();
        return reject(null);
      });
    });
  };

  let promisedArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    promisedArray.push(promisedRunner(inputArray[i], outputArray[i]));
  }

  Promise.all(promisedArray)
    .then(() => {
      // Mark this question as passsed
      interview.problemsSnapshot[req.params.index].allPassed = true;
      interview.save((err, interview) => {
        if (err) return res.status(500).send(err);
        return res.json({ result: 'pass', message: 'Passed all tests' });
      });
    })
    .catch(msg => {
      if (msg == null) return res.json({ result: 'fail', message: 'Failed to pass all tests' });
      return res.json({ result: 'cperror', message: msg });
    });
});

module.exports = router;