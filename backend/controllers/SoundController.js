"use strict";


const { of, observable } = require("rxjs");
const { map, tap, mergeMap, catchError } = require("rxjs/operators");
const dateFormat = require('dateformat');
const Mp3Creator = require("../tools/mp3-creator");
const fs = require('fs');
const CommandExecutor = require('../tools/commands-executor');


const { NeDB } = require('../tools/NeDB');

const SOUNS_BY_DEFAULT = [
  { _id: 'default_0', name: 'Gallo Remix', audios: ['default_0'], default: true },
  { _id: 'default_1', name: 'Profe despierta (Anderson)', audios: ['default_1'], default: true },
]


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
    res.status(200).json([...docs, ...SOUNS_BY_DEFAULT]);
  });

};

exports.createSounds = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  console.log({ requestBody, requestParams });

  const fileName = (requestBody.name || '').replace(/ /g, "_");


  //Faltan hacer validaciones 
  Mp3Creator.createTone(fileName, requestBody.content)
    .then((result) => {

      console.log(result);

      const newSound = {
        name: requestBody.name,
        audios: result
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
      console.log(e);
      res.status(502).send(e);
    });

};

function removeDependencies(songId){
  console.log("ELIMINANDO LAS DEPENCEIAS DEL ", songId);
  NeDB.alarmCollection.update({"tone._id": songId}, { $set: { tone: SOUNS_BY_DEFAULT[0] } }, {multi: true} , (err, updates) => {
    console.log(`La eliminacion del tono afecto a ${updates} documentos` );
  });

}

exports.deleteSounds = (req, res) => {
  if (!req) {
    res.send(202);
  }
  const requestParams = req.params || {};
  const requestBody = req.body || {};
  const id_remove = requestBody._id;

  console.log(__dirname);

  const mp3Path = __dirname.replace("controllers", "resources/mp3");

  NeDB.soundsCollection.findOne({ _id: requestBody._id }, {}, (err, doc) => {
    if (err) {
      res.send(500);
      console.log("Error al encontrar el tono a eliminar", err);
    }

    if(!doc){ res.status(300).json({}) }

    const filesToRemove = doc.audios.map(song => CommandExecutor.executeCustom(`rm ${mp3Path}/${song}.mp3`));
    Promise.all(filesToRemove)
      .then(() => {
        removeDependencies(requestBody._id)
        NeDB.soundsCollection.remove({ _id: requestBody._id }, {}, (err, number) => {
          if (err) {
            res.send(500);
            console.log("Error al encontrar el tono a eliminar", err);
          }

          res.status(200).json({ ok: 200 });

        })

      })
      .catch((err) => {
        res.status(500).json(err);
      })
  });
};


