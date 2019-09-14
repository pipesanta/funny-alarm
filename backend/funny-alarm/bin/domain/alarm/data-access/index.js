"use strict";

const Rx = require('rxjs');

const AlarmDA = require("./AlarmDA");

module.exports = {
  /**
   * Data-Access start workflow
   */
  start$: Rx.concat(AlarmDAteam.start$()),
  /**
   * @returns {msentitypascalDA}
   */
  AlarmDA,
};
