"use strict";

const NeDB = require("./NeDB").singleton();

module.exports = {
  /**
   * 
   * @returns {Observable}
   */
  start$: NeDB.start$(),
  /**
   * @returns {NeDB}
   */
  NeDB
};
