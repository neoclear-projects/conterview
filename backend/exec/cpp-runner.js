"use strict";

const { exec } = require('child_process');

module.exports = function cppRunner(id, interviewId, input, code, callback) {
  const writeProc = exec(`docker exec -i ${id} sh -c \'cat > ${interviewId}.cpp\'`);

  writeProc.stdin.write(code);
  writeProc.stdin.end();

  const randomExecutable = interviewId + Math.random().toString(36);

  // After write code to file, execute
  writeProc.on('exit', (code) => {
    const compileProc = exec(`docker exec ${id} g++ -std=c++17 ${interviewId}.cpp -o ${randomExecutable}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err.stack);
        console.error('Error code: ' + err.code);
        console.error('Signal received: ' + err.signal);
        return callback('', stderr);
      }

      if (stderr.length != 0)
        return callback(stdout, stderr);

      // After finished compilation
      const runProc = exec(`docker exec -i ${id} ./${randomExecutable}`, {
        timeout: 1000
      }, (err, stdout, stderr) => {
        if (err) {
          console.error('Error code: ' + err.code);
          console.error('Signal received: ' + err.signal);
          return callback('', err.message);
        }

        callback(stdout, stderr);
      });

      runProc.stdin.write(input || '');
    });
  });
};
