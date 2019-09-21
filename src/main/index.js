require('v8-compile-cache')

const electron = require('electron')
const { autoUpdater } = require('electron-updater')
const url = require('url')
const path = require('path')

const getURLInfo = require('./controllers/getURLInfo')
const upload = require('./controllers/upload')
const fixScreenRecord = require('./controllers/fixScreenRecord')
const download = require('./controllers/download')
const format = require('./controllers/format')
const prefs = require('./controllers/preferences')
const { initDirectories, clearTempFiles } = require('./controllers/handleExtFiles')

const { app, BrowserWindow, Menu, ipcMain, dialog } = electron

// WINDOW CONFIG

const dev = process.env.NODE_ENV === 'development'
const mac = process.platform === 'darwin'

let win = false
let preferences = false
let help = false

const openWindow = prefs => new BrowserWindow({
  ...prefs,
  show: false,
  backgroundColor: '#eee',
  webPreferences: {
    nodeIntegration: true
  }
})

const mainURL = () => dev ? {
  protocol: 'http:',
  host: 'localhost:3000',
  pathname: 'index.html',
  slashes: true
} : {
  protocol: 'file:',
  pathname: path.join(__dirname, 'build', 'index.html'),
  slashes: true
}

const createWindow = () => {
  initDirectories()
  clearTempFiles()

  win = openWindow({
    width: dev ? 952 : 476,
    height: 780,
    minWidth: 360,
    minHeight: 460
  })

  win.loadURL(url.format(mainURL()))

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

  Menu.setApplicationMenu(mainMenu)

  win.on('ready-to-show', () => {
    win.show()
    if (dev) win.webContents.openDevTools()
  })

  win.on('close', () => {
    win = false
    clearTempFiles()
  })
}

const lock = app.requestSingleInstanceLock()

if (!lock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.on('ready', () => {
    createWindow()

    autoUpdater.autoDownload = true
    autoUpdater.checkForUpdatesAndNotify()
  })
}

app.on('window-all-closed', () => {
  if (!mac) app.quit()
})

app.on('activate', () => {
  if (!win) createWindow()
})


// AUTO-UPDATE CONFIG

autoUpdater.on('update-downloaded', async ({ version }) => {
  const quit = await dialog.showMessageBox({
    type: 'question',
    message: `Able2 v${version} has finished downloading. For the update to take effect Able2 must restart. Close Able2?`,
    buttons: ['Close and Install', 'Not Now']
  })

  if (quit.response === 0) autoUpdater.quitAndInstall()

  win.webContents.send('update-available', false)
})

autoUpdater.on('update-available', ({ version }) => {
  win.webContents.send('update-available', version)
})

autoUpdater.on('download-progress', ({ percent }) => {
  win.webContents.send('update-progress', percent)
})


// MENU CONFIG

const prefsMenuItem = [
  { type: 'separator' },
  {
    label: 'Preferences',
    click() {
      const width = mac ? 530 : 558
      const height = mac ? 339 : 356

      preferences = openWindow({
        parent: win,
        width,
        height,
        minWidth: width,
        maxWidth: width,
        minHeight: height,
        minimizable: false,
        maximizable: false,
      })

      preferences.loadURL(url.format({
        ...mainURL(),
        hash: 'preferences'
      }))

      preferences.once('ready-to-show', () => {
        preferences.show()
      })

      preferences.on('close', () => {
        preferences = false
      })

      preferences.setMenu(null)
    }
  }
]

const mainMenuTemplate = [
  ...(mac ? [{
    label: app.getName(),
    submenu: [
      {
        label: 'About Able2',
        role: 'about'
      },
      ...prefsMenuItem,
      { type: 'separator' },
      {
        label: 'Hide Able2',
        role: 'hide'
      },
      { role: 'hideothers' },
      { type: 'separator' },
      { 
        label: 'Quit Able2',
        role: 'quit'
      }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      mac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo'},
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(!mac ? prefsMenuItem : [])
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Able2 Help',
        click() {
          help = openWindow({
            parent: win,
            width: 476,
            height: 780,
            minWidth: 360,
            minHeight: 460,
            minimizable: false,
            maximizable: false
          })

          help.loadURL(url.format({
            ...mainURL(),
            hash: 'help',
          }))

          help.once('ready-to-show', () => {
            help.show()
          })

          help.on('close', () => {
            help = false
          })

          help.setMenu(null)
        }
      }
    ]
  }
]

if (dev) {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}

ipcMain.on('get-url-info', getURLInfo)
ipcMain.on('upload', upload)
ipcMain.on('fix-screen-record', fixScreenRecord)
ipcMain.on('download', download)
ipcMain.on('format', format)
ipcMain.on('load-prefs', prefs.loadPrefs)
ipcMain.on('save-prefs', (evt, data) => prefs.savePrefs(evt, data, win))

ipcMain.on('clear', (evt) => {
  clearTempFiles().then(() => {
    evt.reply('cleared')
  })
})
