const { exec } = require('child_process');

module.exports = function typescriptRunner(id, interviewId, input, code, callback) {
  const writeProc = exec(`docker exec -i ${id} sh -c \'cat > ${interviewId}.ts\'`);

  writeProc.stdin.write(code);
  writeProc.stdin.end();

  // After write code to file, execute
  writeProc.on('exit', (code) => {
    const execProc = exec(`docker exec -i ${id} ts-node ${interviewId}.ts`, {
      timeout: 1000
    }, (err, stdout, stderr) => {
      if (err) {
        console.error(err.stack);
        console.error('Error code: ' + err.code);
        console.error('Signal received: ' + err.signal);
        return callback('', stderr);
      }

      callback(stdout, stderr);
    });

    execProc.stdin.write(input || '');
  });
};
