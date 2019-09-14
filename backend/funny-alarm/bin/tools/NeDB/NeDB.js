"use strict";

// const Datastore = require('nedb');
// const users = new Datastore({ filename: 'users.db', autoload: true });

// // const users = new Datastore();

// const scott = {
//     name: 'Scott',
//     twitter: '@ScottWRobinson1'
// };

// // users.insert(scott, function(err, doc) {
// //     console.log('Inserted', doc.name, 'with ID', doc._id);
// // });


// users.findOne({ twitter: '@ScottWRobinson12' }, function(err, doc) {
//     console.log('Found user:', doc);
// });


const { bindNodeCallback, Observable } = require("rxjs");
const { map } = require("rxjs/operators");
const NeDBClient = require("nedb");
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;

let instance = null;

class NeDB {
  /**
   * initialize and configure Basic DB
   * @param { { url, dbName } } ops
   */
  constructor() {
      
  }

  /**
   * Starts DB connections
   * @returns {Observable} Obserable that resolve to the DB client
   */
  start$() {
    return bindNodeCallback(MongoClient.connect)(this.url).pipe(
      map(client => {
        ConsoleLogger.i(this.url);
        this.client = client;
        this.db = this.client.db(this.dbName);
        return `NeDB connected to dbName= ${this.dbName}`;
      })
    );
  }

  /**
   * Stops DB connections
   * Returns an Obserable that resolve to a string log
   */
  stop$() {
    return Observable.create(observer => {
      this.client.close();
      observer.next("Basic DB Client closed");
      observer.complete();
    });
  }

  /**
   * Ensure Index creation
   * Returns an Obserable that resolve to a string log
   */
  createIndexes$() {
    return Observable.create(async observer => {
      //observer.next('Creating index for DB_NAME.COLLECTION_NAME => ({ xxxx: 1 })  ');
      //await this.db.collection('COLLECTION_NAME').createIndex( { xxxx: 1});

      observer.next("All indexes created");
      observer.complete();
    });
  }

  /**
   * extracts every item in the mongo cursor, one by one
   * @param {*} cursor
   */
  extractAllFromMongoCursor$(cursor) {
    return Observable.create(async observer => {
      let obj = await MongoDB.extractNextFromMongoCursor(cursor);
      while (obj) {
        observer.next(obj);
        obj = await MongoDB.extractNextFromMongoCursor(cursor);
      }
      observer.complete();
    });
  }

  /**
   * Extracts the next value from a mongo cursos if available, returns undefined otherwise
   * @param {*} cursor
   */
  static async extractNextFromMongoCursor(cursor) {
    const hasNext = await cursor.hasNext();
    if (hasNext) {
      const obj = await cursor.next();
      return obj;
    }
    return undefined;
  }
}

module.exports = {
  NeDB,
  singleton() {
    if (!instance) {
      instance = new NeDB();
      ConsoleLogger.i(`NeDB instance created`);
    }
    return instance;
  }
};
