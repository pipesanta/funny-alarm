"use strict";

const rootRoute = "sound";
const soundController = require("../controllers/SoundController");

module.exports = {
  applyRoutes: (app) => {
    app.route(`/${rootRoute}`).get(soundController.welcomeMessage); // welcome Message
    app.route(`/${rootRoute}/getSounds`).get(soundController.getSounds); // get all Sounds
    app.route(`/${rootRoute}/createSound`).get(soundController.createSounds); // get all Sounds
    app.route(`/${rootRoute}/deleteSound`).post(soundController.deleteSounds); // delete Sounds

  }
  
};
