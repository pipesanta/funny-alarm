const exec = require("child_process").exec;

exports.sendMessageToArduino = (message)=> {
    return new Promise( (resolve, reject) => {
        const scriptPath = __dirname.replace("backend/tools/commands-executor", `rpi-scripts/sendMessageToArduino.py`);
    
        child = exec(`python ${scriptPath}  "${message}"`, (error, stdout, stderr) => {
          console.log("stdout: " + stdout);
          console.log("stderr: " + stderr);
          if (error !== null) {
            console.log("exec error: " + error);
            reject(error);
          }
          resolve('TERMINADO');
        });
    
      });
}

exports.executeCustom = (command) => {
  return new Promise( (resolve, reject) => {
    child = exec(command, (error, stdout, stderr) => {
      console.log("stdout: " + stdout);
      console.log("stderr: " + stderr);
      if (error !== null) {
        console.log("exec error: " + error);
        reject(error);
      }
      resolve('TERMINADO');
    });

  });
}