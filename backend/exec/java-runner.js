const { exec } = require('child_process');

module.exports = function javaRunner(id, interviewId, code, callback) {
  const writeProc = exec(`docker exec -i ${id} sh -c \'cat > ${interview}.java\'`);

  writeProc.stdin.write(code);
  writeProc.stdin.end();

  // After write code to file, execute
  writeProc.on('exit', (code) => {
    const execProc = exec(`docker exec ${id} java ${interview}.java`, (err, stdout, stderr) => {
      if (err) {
        console.error(err.stack);
        console.error('Error code: ' + err.code);
        console.error('Signal received: ' + err.signal);
        return callback(stderr);
      }

      callback(stdout + stderr);
    });
  });
};
