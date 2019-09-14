"use strict";

const { concat } = require("rxjs");
const basicDB = require("./BasicDB").singleton();

module.exports = {
  /**
   * start workflow
   * @returns {Observable}
   */
  start$: basicDB.start$(),
  /**
   * start for syncing workflow
   * @returns {Observable}
   */
  startForSyncing$: basicDB.start$(),
  /**
   * start for getting ready workflow
   * @returns {Observable}
   */
  startForGettingReady$: concat(basicDB.start$(),basicDB.createIndexes$()),
  /**
   * Stop workflow
   * @returns {Observable}
   */
  stop$: basicDB.stop$(),
  /**
   * @returns {basicDB}
   */
  basicDB,
};
