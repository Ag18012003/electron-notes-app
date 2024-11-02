const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('save-note', async (event, note) => {
  const notes = JSON.parse(fs.readFileSync('notes.json', 'utf-8'));
  notes.push(note);
  fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
  return notes;
});

ipcMain.handle('load-notes', async () => {
  if (!fs.existsSync('notes.json')) fs.writeFileSync('notes.json', JSON.stringify([]));
  const notes = JSON.parse(fs.readFileSync('notes.json', 'utf-8'));
  return notes;
});
