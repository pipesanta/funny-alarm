'use strict'

require('dotenv').load();
const express = require("express");
const { Observable, concat, of, defer } = require('rxjs')
const app = express();
const bodyParser = require('body-parser');
const port = parseInt(process.env.REST_END_POINT_PORT || '7070');
const endPoint = process.env.REST_HTTP_END_POINT || 'localhost';

const { AlarmRoutes } = require('./routes');
const routesInDomain = [AlarmRoutes];

const { NeDB } = require('./tools/NeDB');
const Mp3Creator = require('./tools/mp3-creator');



app.use( (req, res, next) => {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function startExpress$() {
  return Observable.create(observer => {
    observer.next("Starting express aplication");
    routesInDomain.forEach(route => route.applyRoutes(app));

    app.get('', (req, res) => {
      res.send(req.params);
    });

    app.listen(port, () => {
      console.log(`REST server is running at ${endPoint}:${port}`);
    });

    observer.complete();
  });
}

concat(
  NeDB.start$(),
  startExpress$(),
  defer(() => Mp3Creator.createFile('hola', 'hola este es el contenido') )
).subscribe(
  ok => {
    console.log('ok', ok)
  },
  error => {
    console.log('ERROR ===> ', error)
  },
  () => {
    console.log('on complete')
  }
)