import electron from 'electron'
import url from 'url'
import path from 'path'

import getURLInfo from './modules/load_video/getURLInfo'
import upload from './modules/load_video/upload'
import saveScreenRecord from './modules/load_video/saveScreenRecord'
import fileExistsPromise from './modules/utilities/fileExistsPromise'
import download from './modules/process_video/download'
import format from './modules/process_video/format'
import { loadPrefs, savePrefs } from './modules/preferences'
import { initTempDirectory, clearTempFiles } from './modules/utilities/handleExtFiles'
import update from './modules/update'
import insertPCStyles from './modules/utilities/insertPCStyles'

const { app, BrowserWindow, Menu, ipcMain } = electron

// WINDOW CONFIG

const dev = process.env.NODE_ENV === 'development'
const mac = process.platform === 'darwin'

let win = false
let preferences = false
let help = false

const openWindow = opts => new BrowserWindow({
  ...opts,
  show: false,
  backgroundColor: '#eee',
  webPreferences: {
    nodeIntegration: dev,
    enableEval: false,
    preload: dev
      ? path.join(__dirname, 'preload', 'babelRegister.js')
      : path.join(__dirname, 'preload.js')
  }
})

const getURL = view => url.format(dev ? {
  protocol: 'http:',
  host: 'localhost:3000',
  pathname: `${view}.html`,
  slashes: true
} : {
  protocol: 'file:',
  pathname: path.join(__dirname, 'renderer', `${view}.html`),
  slashes: true
})

const createWindow = () => {
  initTempDirectory()
  clearTempFiles()

  win = openWindow({
    width: dev ? 952 : 476,
    height: 780,
    minWidth: 360,
    minHeight: 460
  })

  win.loadURL(getURL('index'))

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

  Menu.setApplicationMenu(mainMenu)

  if (!mac) insertPCStyles(win)

  win.on('ready-to-show', () => {
    if (dev) win.webContents.openDevTools()
    win.show()
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

  app.on('ready', createWindow)
}

app.on('window-all-closed', () => {
  if (!mac) app.quit()
})

app.on('activate', () => {
  if (!win) createWindow()
})


// MENU CONFIG

const prefsMenuItem = [
  { type: 'separator' },
  {
    label: 'Preferences',
    accelerator: 'CmdOrCtrl+,',
    click() {
      const width = mac ? 530 : 558
      const height = mac ? 339 : 356

      preferences = openWindow({
        parent: win,
        width,
        height,
        minWidth: width,
        maxWidth: dev ? false : width,
        minHeight: height,
        minimizable: false,
        maximizable: false
      })

      preferences.loadURL(getURL('preferences'))

      if (!mac) insertPCStyles(preferences)

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
    label: app.name,
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

          help.loadURL(getURL('help'))

          if (!mac) insertPCStyles(help)

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

// ---- IPC ROUTES ----

ipcMain.on('getURLInfo', async (evt, urlData) => {
  try {
    evt.reply('urlInfoRetrieved', await getURLInfo(urlData))
  } catch (err) {
    evt.reply('urlInfoErr', err)
  }
})

ipcMain.on('uploadFile', async (evt, files) => {
  try {
    const info = await upload(files)
    evt.reply('fileUploaded', info)
  } catch (err) {
    evt.reply('fileUploadErr', err)
    clearTempFiles()
  }
})

ipcMain.on('saveScreenRecord', async (evt, buffer) => {
  try {
    const fileInfo = await saveScreenRecord(buffer)
    evt.reply('screenRecordSaved', fileInfo)
  } catch (err) {
    evt.reply('saveScreenRecordErr', err)
    clearTempFiles()
  }
})

ipcMain.handle('checkIfDirectoryExists', async (evt, dir) => {
  try {
    return fileExistsPromise(dir)
  } catch (err) {
    return false
  }
})

ipcMain.on('download', async (evt, formData) => {
  try {
    await download(formData, win)
    evt.reply('downloadComplete')
  } catch (err) {
    evt.reply('downloadErr', err === 'canceled' ? 'INIT' : 'DOWNLOAD_ERROR')
    clearTempFiles()
  }
})

ipcMain.on('render', async (evt, formData) => {
  try {
    await format(formData, win)
    evt.reply('renderComplete')
  } catch (err) {
    evt.reply('renderErr', err === 'canceled' ? 'INIT' : 'RENDER_ERROR')
    clearTempFiles()
  }
})

ipcMain.on('requestPrefs', async evt => {
  try {
    evt.reply('prefsRecieved', await loadPrefs())
  } catch (err) {
    evt.reply('prefsErr', err)
  }
})

ipcMain.on('savePrefs', async (evt, newPrefs) => {
  try {
    await savePrefs(newPrefs)
    evt.reply('prefsSaved')
    win.webContents.send('syncPrefs', newPrefs)
  } catch (err) {
    evt.reply('savePrefsError')
  }
})

ipcMain.handle('clear', async () => {
  try {
    return clearTempFiles()
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('checkForUpdates', async evt => {
  try {
    await update()
    evt.reply('updateComplete')
  } catch (err) {
    evt.reply('updateErr', err)
  }
})
