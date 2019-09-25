
const sys = require("sys");
const exec = require("child_process").exec;



exports.playAudio = (fileName) => {
  return new Promise(async function (resolve, reject) {

    const filepathAndName = __dirname.replace("tools/mp3-player", `resources/mp3/${fileName}`);



    child = exec(`mpg321 ${filepathAndName}`, (error, stdout, stderr) => {
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