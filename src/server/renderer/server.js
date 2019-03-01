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
const proxy = require('express-http-proxy');

// ---- local modules
const render = require('./renderer');

// ---- local variables
const server = express();

// creates the server
exports.create = function (config) {
  // Server settings
  server.set('x-powered-by', false);
  server.set('env', config.env);
  server.set('port', config.renderer.port);
  server.set('host', config.renderer.host);

  // Setup middleware
  server.use('/api', proxy('http://' + config.api.host + ':' + config.api.port));
  server.use(express.static('static')); // express will automatically looks for files (scripts, css) in the static folder when requested by the browser

  // Setup route
  server.get('/*', (req, res) => {

    render.window(

    //#region ViperHTML //-------------------------------------------------
      // chunks
      chunk => res.write(chunk), 
      // model
      {
        language: 'item',
        title: 'item',
        main: render.item({ body: 'item' }),
        button: render.button({ }),
      }    
    //#endregion ViperHTML //---------------------------------------------
      
    )
      .then(() => res.end())
      .catch(err => { console.error(err); res.end(); });

  });
};


// Starts the server
exports.start = function () {
  const host = server.get('host'),
    port = server.get('port');

  server.listen(port, function () {
    console.log('Renderer Server listening on - http://' + host + ':' + port);
  });
};


// Stops the server
exports.stop = function () {
  if (server) {
    server.close();
  }
};



