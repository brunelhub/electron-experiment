/**
 * Bootstrap of the server
 * 
 * Performs basic initialization
 * Creates/starts the server
 *
**/

'use strict';

// ---- node modules
const express = require('express');

// ---- local modules

// ---- local variables
const server = express();

// creates the server
exports.create = function (config) {
  // Server settings
  server.set('x-powered-by', false);
  server.set('env', config.env);
  server.set('port', config.api.port);
  server.set('host', config.api.host);

  // Setup route
  server.use(express.static('static')); // express will automatically looks for files (scripts, css) in the static folder when requested by the browser
  server.get('/*', (req, res) => {

    res.send('response from API');

  });
};


// Starts the server
exports.start = function () {
  const host = server.get('host'),
    port = server.get('port');

  server.listen(port, function () {
    console.log('API Server listening on - http://' + host + ':' + port);
  });
};


// Stops the server
exports.stop = function () {
  if (server) {
    server.close();
  }
};



