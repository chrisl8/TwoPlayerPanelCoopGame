const express = require('express');
const stationList = require('./stationList');
const gameState = require('./gameState');
const settings = require('./settings');

function webServer({ port = 3000 } = {}) {
  const app = express();

  // Add headers
  app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    );

    // Request headers you wish to allow
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With,content-type',
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

  app.listen(port);
  // with Sockets?
  // const webServer = app.listen(webPort);
  // const socket = require('socket.io').listen(webServer);

  // If no path is given, return files from parent folder (in lieu of what I usually put in 'public')
  // This will allow the web site to run from this process too.
  app.use(express.static(`${__dirname}/../`));

  app.get('/stations', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const dataToSend = {
      buttonState: stationList,
      score: gameState.score,
      timeRemaining:
        gameState.maxTime * (1000 / settings.loopTime) - gameState.timeElapsed,
    };
    res.send(JSON.stringify(dataToSend));
  });
}

module.exports = webServer;
