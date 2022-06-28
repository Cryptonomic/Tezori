// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');
function createWindow () {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: false,
      devTools: isDev
    }
  })

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    mainWindow.loadURL(url);
  });

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

