'use strict'

require('dotenv').load();
const express = require("express");
const { Observable, concat, of } = require('rxjs')
const app = express();
const bodyParser = require('body-parser');
const port = parseInt(process.env.REST_END_POINT_PORT || '7070');
const endPoint = process.env.REST_HTTP_END_POINT || 'localhost';

const { AlarmRoutes } = require('./routes');
const routesInDomain = [AlarmRoutes];

const { NeDB } = require('./tools/NeDB');

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use(express.json());

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
  startExpress$()
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