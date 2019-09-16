"use strict";

const rootRoute = "alarm";
const alarmController = require("../controllers/AlarmController");

module.exports = {
  applyRoutes: (app) => {
    app.route(`/${rootRoute}`).get(alarmController.welcomeMessage); // welcome Message
    app.route(`/${rootRoute}/getAlarms`).get(alarmController.getAlarms); // welcome Message

  }
  
};
