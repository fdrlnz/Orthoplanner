const { app, BrowserWindow } = require('electron');
const path = require('path');

// Determina se siamo in sviluppo o produzione
const isDev = process.env.NODE_ENV !== 'production' || !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'OrthoPlanner',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Nascondi la barra menu di default di Electron
    autoHideMenuBar: true,
  });

  if (isDev) {
    // In sviluppo: carica dal server Vite
    mainWindow.loadURL('http://localhost:5173');
    // Apri DevTools automaticamente in sviluppo
    mainWindow.webContents.openDevTools();
  } else {
    // In produzione: carica i file compilati
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

// Quando Electron è pronto, crea la finestra
app.whenReady().then(createWindow);

// Chiudi l'app quando tutte le finestre sono chiuse (Windows/Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS: ricrea la finestra se clicchi sull'icona nel dock
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
