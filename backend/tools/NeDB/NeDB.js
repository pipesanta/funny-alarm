"use strict";

const { of, Observable } = require("rxjs");
const { map } = require("rxjs/operators");
const NeDBClient = require('nedb');
const alarmsCollection = new NeDBClient({ filename: 'dataStorage/alarm.db', autoload: true });
const soundsCollection = new NeDBClient({ filename: 'dataStorage/sounds.db', autoload: true });


let instance = null;

class NeDB {
  /**
   * initialize and configure NeDB
   * @param { { url, dbName } } ops
   */
  constructor() {


  }

  start$() {
    console.log('on -------- neDB.start$');
    return Observable.create(observer => {

      console.log('CREANDO INSTANCIA DE NEDB');
      this.client = NeDBClient;
      /** @type { NeDBClient } */
      this.alarmCollection = alarmsCollection;
      /** @type { NeDBClient } */
      this.soundsCollection = soundsCollection;
      observer.complete();
    });
  }

}

module.exports = {
  /** @returns { NeDB } */
  NeDB,
  /** @returns { NeDB } */
  singleton() {
    if (!instance) {
      instance = new NeDB();
      console.log(`NeDB instance created`);
    }
    return instance;
  }
};
