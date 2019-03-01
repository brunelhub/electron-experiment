/**
 * main.js makes use of node-cluster to take advantage 
 * of multi core processors. In a real web application context,
 * horizontal scaling (adding more machines) would be needed, 
 * as well as a load-balancing solution.
 */

'use strict';

// ---- node modules
const { app, BrowserWindow } = require('electron'); 
const cluster = require('cluster');

// ---- local modules
const config = require('./config');


//#region ELECTRON //-------------------------------------------------
// ---- local variables
// Keep a global ref of the window object to avoid GB
let mainWindow; 

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 728,
    minWidth: 600,
    minHeight: 300,
    frame: false,
    show: false,
    webPreferences: {
      'backgroundThrottling': false
    }
  });

  mainWindow.loadURL('http://' + config.renderer.host + ':' + config.renderer.port);
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.openDevTools({ mode: 'undocked' });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function initElectron() {
  app.on('ready', createWindow);
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });
}
//#endregion ELECTRON //----------------------------------------------

//#region CLUSTER SETUP //--------------------------------------------
if (cluster.isMaster) {
  initElectron();
  console.log(`Electron (${process.pid}) has started.`);

  // Start all the workers process
  const apiEnv = { WorkerName: 'apiServer' };
  const rendererEnv = { WorkerName: 'rendererServer' };
  let apiServer = cluster.fork(apiEnv);
  let rendererServer = cluster.fork(rendererEnv);
  // Worker process.env is not exposed to master so we store it here
  apiServer.process.env = apiEnv;
  rendererServer.process.env = rendererEnv;

  //#region IPC Check
  // Receive messages from the workers and handle them in the master process.
  // apiServer.on('message', function (msg) {
  //   console.log(`Electron (${process.pid}) received message from Api Server (${this.process.pid}).`, msg);
  // });
  // rendererServer.on('message', function (msg) {
  //   console.log(`Electron (${process.pid}) received message from renderer Server (${this.process.pid}).`, msg);
  // });

  // Send messages from the master process to the workers.
  // apiServer.send({ msgFromMaster: `This is from Electron (${process.pid}) to Api Server ${apiServer.process.pid}.` });
  // rendererServer.send({ msgFromMaster: `This is from Electron (${process.pid}) to renderer Server ${rendererServer.process.pid}.` });
  //#endregion IPC Check

  //#region Workers listeners
  cluster.on('online', function (worker) {
    console.log(`Worker server "${worker.process.env.WorkerName}" is online (ID: ${worker.id}, PID: ${worker.process.pid})`);
  });

  cluster.on('exit', function (worker, code) {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker server "${worker.process.env.WorkerName}" crashed (ID: ${worker.id}, PID: ${worker.process.pid})
                  starting a new worker...`);
      if (worker == apiServer) {
        apiServer = cluster.fork(apiEnv);
        apiServer.process.env = apiEnv;
      }
      if (worker == rendererServer) {
        rendererServer = cluster.fork(rendererEnv);
        rendererServer.process.env = rendererEnv;
      }
    }
  });
  //#endregion Workers listeners

}

else if (cluster.isWorker && process.env.WorkerName === 'apiServer') {
  // API SERVER context
  require('./server/api/index.js');
}

else if (cluster.isWorker && process.env.WorkerName === 'rendererServer') {
  // RENDERER SERVER context
  require('./server/renderer/index.js');
}
//#endregion CLUSTER SETUP //-----------------------------------------