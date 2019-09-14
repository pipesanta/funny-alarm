"use strict";

const { concat } = require("rxjs");
const NeDB = require("./NeDB").singleton();

module.exports = {
  /**
   * start workflow
   * @returns {Observable}
   */
  start$: NeDB.start$(),
  /**
   * start for syncing workflow
   * @returns {Observable}
   */
  startForSyncing$: NeDB.start$(),
  /**
   * start for getting ready workflow
   * @returns {Observable}
   */
  startForGettingReady$: concat(NeDB.start$(),NeDB.createIndexes$()),
  /**
   * Stop workflow
   * @returns {Observable}
   */
  stop$: NeDB.stop$(),
  /**
   * @returns {NeDB}
   */
  NeDB,
};
