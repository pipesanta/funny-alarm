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
  res.status(200).send("Gateway Route created For Alarm domain");
};

exports.getAlarms = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  console.log({ requestParams, requestBody });
  const newAlarm =  {
     name: 'casa' 
  }
  NeDB.alarmCollection.insert(newAlarm, (err, doc) => {
    if(err){
      res.status(502).send(err)
    }
    res.status(200).json(doc);
  });
  
};

exports.createAlarm = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  console.log({ requestParams, requestBody });

  res.status(200).json({ response: 'NO IMPLEMENTADO' });
};
exports.updateAlarm = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};

  res.status(200).json({ response: 'NO IMPLEMENTADO' });
};

exports.deleteAlarm = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};

  res.status(200).json({ response: 'NO IMPLEMENTADO' });
};


