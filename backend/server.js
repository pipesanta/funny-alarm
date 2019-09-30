'use strict'

require('dotenv').load();
const express = require("express");
const { Observable, concat, of, defer } = require('rxjs')
const app = express();
const bodyParser = require('body-parser');
const port = parseInt(process.env.REST_END_POINT_PORT || '7070');
const endPoint = process.env.REST_HTTP_END_POINT || 'localhost';

const { AlarmRoutes, SoundsRoutes } = require('./routes');
const routesInDomain = [AlarmRoutes, SoundsRoutes];

const { NeDB } = require('./tools/NeDB');
const Mp3Creator = require('./tools/mp3-creator');
const Mp3Player = require('./tools/mp3-player');
const CommandsExecutor = require('./tools/commands-executor');



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
  defer(() => CommandsExecutor.sendMessageToArduino('mensaje de prueba') )
  
  // defer(() => Mp3Creator.createFile('hola1', 'Para que zapatos?. para que hijueputas, si no hay casa.') ),
  // defer(() => Mp3Player.playAudio([])),
  // defer(() => Mp3Creator.multiple())
  // defer(() => Mp3Creator.createTone('despierta',`The GIT system uses the SSH protocol to transfer data between the server and your local computers. This means that in order to clone the repository you need to have SSH access to your SiteGround hosting account. To see the SSH key, you can click on the Info button next to the entry for your repository Due to security reasons the password for your SSH key will not be displayed in the tool. If you do not know your SSH key password, you will have generate a new key from the SSH/Shell Access tool in cPanel. You can check our detailed SSH tutorial for more information how to manage your SSH keys` ))
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