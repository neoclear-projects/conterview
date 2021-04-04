const router = require('express').Router();
const pythonRunner = require('../exec/python-runner');
const cppRunner = require('../exec/cpp-runner');
const javaRunner = require('../exec/java-runner');
const javascriptRunner = require('../exec/javascript-runner');
const typescriptRunner = require('../exec/typescript-runner');

const { ProblemSet } = require('../model/problem-set.model');

const executor = {
  'python': pythonRunner,
  'cpp': cppRunner,
  'java': javaRunner,
  'javascript': javascriptRunner,
  'typescript': typescriptRunner
};

router.route('/run/:interviewId').post((req, res) => {
  const { language, code } = req.body;
  const interviewId = req.params.interviewId;

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

router.route('/test/:interviewId/problem/:problemId').post((req, res) => {
  const { language, code } = req.body;
  const interviewId = req.params.interviewId;
  const problemId = req.params.problemId;

  ProblemSet.findOne({_id: problemId}, (err, dat) => {
    if (err) return res.status(500).send(err);
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
        return res.json({ result: 'pass', message: 'Passed all tests' })
      })
      .catch(msg => {
        if (msg == null) return res.json({ result: 'fail', message: 'Failed to pass all tests' });
        return res.json({ result: 'cperror', message: msg });
      });
  });
});

module.exports = router;
