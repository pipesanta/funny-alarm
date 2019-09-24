
const { createAudio } = require('node-mp3-player')
const Audio = createAudio();


exports.playAudio = (fileName) => {
  return new Promise(async function (resolve, reject) {

    const filepathAndName = __dirname.replace("tools/mp3-player", `resources/mp3/${fileName}`);

    const myFile = await Audio(filepathAndName);
    await myFile.play() // plays the file
    await myFile.stop() // stops the file
    resolve(filepathAndName);
    // await myFile.volume(0.5)
    // const currentVolume = await myFile.volume() // 0.5
    // await myFile.loop()
    // await myFile.stop()







  });


}