"use strict";


const { of, observable } = require("rxjs");
const { map, tap, mergeMap, catchError } = require("rxjs/operators");
const dateFormat = require('dateformat');
const Mp3Creator = require("../tools/mp3-creator"); 

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
    msg: "Gateway Route created For Sound domain"
  });
};

exports.getSounds = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  console.log({ requestParams, requestBody });
  NeDB.soundsCollection.find({}, (err, docs) => {
    if (err) {
      res.status(502).send(err)
    }
    res.status(200).json(docs);
  });

};

exports.createSounds = (req, res) => {
  ///////////////////////////////////
  const prueba1 = {
    name : "Prueba número 1",
    content : "ESTE MENSAJE ES UNA PRUEBA Y SE TIENE QUE BORRAR"    
  }
  req.body=prueba1;
  ///////////////////////////////////
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  console.log({ requestBody, requestParams });


  //Faltan hacer validaciones 
  Mp3Creator.createTone(requestBody.name, requestBody.content)
  .then((result) => {
    const newSound = {
      name : requestBody.name,
      parts : result
    }
    NeDB.soundsCollection.insert(newSound, (err, doc) => {
    if (err) {
      console.log(err);
      res.status(502).send(err);
    }
    res.status(200).json(doc);
  });

  })
  .catch((e) => {
    res.status(502).send(e);
  });



  

};

exports.deleteSounds = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  const id_remove = requestBody._id;

  NeDB.soundsCollection.remove({ _id: id_remove }, {}, (err, numRemoved) => {
    if (err) {
      res.send(500);
      console.log("Error al eliminar el tono", err);
    }
    res.status(200).json(numRemoved);
    console.log("El documento se borró con éxito", id_remove, numRemoved)
  });
};


