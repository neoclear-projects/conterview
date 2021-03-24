const router = require('express').Router();
const pythonRunner = require('../exec/python-runner');
const cppRunner = require('../exec/cpp-runner');
const javaRunner = require('../exec/java-runner');
const javascriptRunner = require('../exec/javascript-runner');
const typescriptRunner = require('../exec/typescript-runner');

const executor = {
  'python': pythonRunner,
  'cpp': cppRunner,
  'java': javaRunner,
  'javascript': javascriptRunner,
  'typescript': typescriptRunner
};

router.route('/run').post((req, res) => {
  const { language, code } = req.body;

  let runner = executor[language];
  
  // Return if no corresponding language
  if (runner === undefined) {
    console.log(language);
    return res.status(404).send('Language not found');
  }

  runner('core', code, (output) => {
    return res.json({
      "output": output
    });
  });
});

module.exports = router;
