const { app, BrowserWindow, shell, session } = require('electron');
const URL_APP = 'https://daliadapp.dav-intertenement.workers.dev/';
function create() {
  const w = new BrowserWindow({ width: 1280, height: 820, minWidth: 420, minHeight: 600, title: 'Daliad', backgroundColor: '#ffffff', autoHideMenuBar: true });
  w.webContents.setUserAgent(w.webContents.getUserAgent() + ' DaliadDesktop/1.0');
  w.loadURL(URL_APP);
  w.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(URL_APP)) return { action: 'allow' };
    shell.openExternal(url); return { action: 'deny' };
  });
  w.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(URL_APP) && !url.includes('supabase.co') && !url.includes('livekit')) { e.preventDefault(); shell.openExternal(url); }
  });
}
app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((wc, perm, cb) =>
    cb(['media', 'notifications', 'geolocation', 'clipboard-read', 'fullscreen'].includes(perm)));
  create();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) create(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
