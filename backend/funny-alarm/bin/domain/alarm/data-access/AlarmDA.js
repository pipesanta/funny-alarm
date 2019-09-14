"use strict";

let neDB = undefined;
const { map } = require("rxjs/operators");
const { of, Observable, defer } = require("rxjs");


const CollectionName = 'msentitypascal';

class msentitypascalDA {
  static start$(neDBInstance) {
    return Observable.create(observer => {
      if (neDBInstance) {
        neDB = neDBInstance;
        observer.next(`${this.name} using given neDB instance`);
      } else {
        neDB = require("../../../tools/NeDB/NeDB").singleton();
        observer.next(`${this.name} using singleton system-wide neDb instance`);
      }
      observer.next(`${this.name} started`);
      observer.complete();
    });
  }

  /**
   * Gets an user by its username
   */
  static getAlarm$(id) {
    return of({id: id, name: 'fake result'});
  }


}
/**
 * @returns {msentitypascalDA}
 */
module.exports = AlarmDA;
