const exec = require("child_process").exec;

exports.playAudio = (files) => {
  return new Promise(async function (resolve, reject) {
    const fileRoutes = [];
    const mp3Path = __dirname.replace("tools/mp3-player", `resources/mp3/`)
    files.forEach((sound)=> {
      fileRoutes.push(mp3Path+sound+".mp3");
    });

    child = exec(`mpg321 ${fileRoutes.join(" ")}`, (error, stdout, stderr) => {
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
