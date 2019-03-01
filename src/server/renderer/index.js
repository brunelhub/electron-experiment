/**
 * Renderer entry point
**/
'use strict';

const
  config = require('../../config'),
  server = require('./server');


server.create(config);
server.start();


//#region IPC Check
// Send message to master process.
// process.send({ msgFromWorker: `This is from Renderer Server (${process.pid}).` })

// Receive messages from the master process.
// process.on('message', function (msg) {
//   console.log(`Renderer Server (${process.pid}) received message from Electron.`, msg);
// });
//#endregion IPC Check


