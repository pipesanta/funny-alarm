"use strict";


const { of, observable } = require("rxjs");
const { map, tap, mergeMap, catchError } = require("rxjs/operators");
const dateFormat = require('dateformat');

const { NeDB } = require('../tools/NeDB');


const dateFormatter = function (timestamp) {
  // 2019-06-27 11:06:51 // Format expected
  return dateFormat(new Date(new Date(timestamp).toLocaleString('es-CO', { timeZone: 'America/Bogota' })), "yyyy-mm-dd hh:mm:ss")
}


exports.welcomeMessage = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  res.status(200).json({
    code: 200,
    msg: "Gateway Route created For Alarm domain"
  });
};

exports.getAlarms = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  console.log({ requestParams, requestBody });
  NeDB.alarmCollection.find({}, (err, docs) => {
    if (err) {
      res.status(502).send(err)
    }
    res.status(200).json(docs);
  });

};

exports.createAlarm = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  console.log({ requestBody, requestParams });


  const newAlarm = requestBody;
  //Faltan hacer validaciones 

  NeDB.alarmCollection.insert(newAlarm, (err, doc) => {
    if (err) {
      console.log(err);
      res.status(502).send(err);
    }
    res.status(200).json(doc);
  });

};
exports.updateAlarm = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};

  const idUpdate = requestBody._id;
  console.log('UPDATE ==>', { ...requestBody} );


  NeDB.alarmCollection.update({ _id: idUpdate }, {
    $set: {
      ...requestBody
    }
  }, { multi: true }, (err, numReplaced) => {
    if (err) {
      res.send(500);
      console.log("Error al actualizar alarma", err);
    }
    res.status(200).json(numReplaced);
    console.log("El documento se actualizó con éxito", idUpdate, numReplaced);
  });
};

exports.deleteAlarm = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  const id_remove = requestBody._id;

  NeDB.alarmCollection.remove({ _id: id_remove }, {}, (err, numRemoved) => {
    if (err) {
      res.send(500);
      console.log("Error al eliminar alarma", err);
    }
    res.status(200).json(numRemoved);
    console.log("El documento se borró con éxito", id_remove, numRemoved)
  });
};


