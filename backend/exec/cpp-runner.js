const { exec } = require('child_process');

module.exports = function cppRunner(id, interviewId, code, callback) {
  const writeProc = exec(`docker exec -i ${id} sh -c \'cat > ${interview}.cpp\'`);

  writeProc.stdin.write(code);
  writeProc.stdin.end();

  // After write code to file, execute
  writeProc.on('exit', (code) => {
    const compileProc = exec(`docker exec ${id} g++ -std=c++17 ${interviewId}.cpp -o ${interviewId}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err.stack);
        console.error('Error code: ' + err.code);
        console.error('Signal received: ' + err.signal);
        return callback(stderr);
      }

      if (stderr.length != 0)
        return callback(stdout + stderr);

      // After finished compilation
      const runProc = exec(`docker exec ${id} ./${interviewId}`, (err, stdout, stderr) => {
        if (err) {
          console.error(err.stack);
          console.error('Error code: ' + err.code);
          console.error('Signal received: ' + err.signal);
          return callback(err.message);
        }

        callback(stdout + stderr);
      });
    });
  });
};
