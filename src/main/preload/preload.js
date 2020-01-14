import { ipcRenderer, remote } from 'electron'
import path from 'path'
import setContextMenu from './setContextMenu'
import sendMessage from './sendMessage'
import { startRecording, stopRecording } from './screenRecorder'

const interop = {}

// ------ IPC ROUTES ------

interop.getURLInfo = urlData => sendMessage({
  sendMsg: 'getURLInfo',
  recieveMsg: 'urlInfoRetrieved',
  errMsg: 'urlInfoErr',
  data: urlData
})

interop.uploadFile = files => sendMessage({
  sendMsg: 'uploadFile',
  recieveMsg: 'fileUploaded',
  errMsg: 'fileUploadErr',
  data: files
})

interop.download = async (onStarted, onProgress, formData) => {
  ipcRenderer.once('downloadStarted', () => onStarted())
  ipcRenderer.on('downloadProgress', (evt, progress) => onProgress(progress))

  return sendMessage({
    sendMsg: 'download',
    recieveMsg: 'downloadComplete',
    errMsg: 'downloadErr',
    data: formData
  })
}

interop.render = async (onStarted, onProgress, formData) => {
  ipcRenderer.once('renderStarted', () => onStarted())
  ipcRenderer.on('renderProgress', (evt, progress) => onProgress(progress))

  return sendMessage({
    sendMsg: 'render',
    recieveMsg: 'renderComplete',
    errMsg: 'renderErr',
    data: formData
  })
}

interop.removeDownloadRenderListeners = async () => {
  ipcRenderer.removeAllListeners([
    'downloadStarted',
    'downloadProgress',
    'downloadErr',
    'downloadComplete',
    'renderStarted',
    'renderProgress',
    'renderErr',
    'renderComplete'
  ])
}

interop.cancelProcess = async () => {
  ipcRenderer.send('cancelProcess')
}

interop.clearTempFiles = async () => ipcRenderer.invoke('clear')

interop.requestPrefs = () => sendMessage({
  sendMsg: 'requestPrefs',
  recieveMsg: 'prefsRecieved',
  errMsg: 'prefsErr'
})

interop.savePrefs = prefs => sendMessage({
  sendMsg: 'savePrefs',
  recieveMsg: 'prefsSaved',
  errMsg: 'savePrefsErr',
  data: prefs
})

interop.addPrefsSyncListener = listener => {
  ipcRenderer.on('syncPrefs', (evt, newPrefs) => {
    listener(newPrefs)
  })
}

interop.removePrefsSyncListener = () => {
  ipcRenderer.removeAllListeners('syncPrefs')
}

interop.checkForUpdates = (onFound, onProgress) => {
  ipcRenderer.once('updateFound', (evt, version) => onFound({
    status: 'updating',
    version
  }))

  ipcRenderer.on('updateProgress', (evt, percent) => onProgress(percent))

  return sendMessage({
    sendMsg: 'checkForUpdates',
    recieveMessage: 'updateComplete',
    errMsg: 'updateErr'
  })
}

interop.removeUpdateListeners = () => {
  ipcRenderer.removeAllListeners([
    'checkForUpdates',
    'updateFound',
    'updateProgress',
    'updateComplete',
    'updateErr'
  ])
}

// ------ DIALOG ------

interop.dialog = Object.freeze({
  sourceOnTopAlert: async () => (await remote.dialog.showMessageBox({
    type: 'warning',
    buttons: ['OK', 'Cancel'],
    message: 'A source on top is not for aesthetics!',
    detail: 'This option shoud only be selected if the source would obscure important details or appear illegible at the bottom of the video. If you are using this option for any other reason please choose cancel.'
  })).response,
  directoryNotFoundAlert: async dir => (await remote.dialog.showMessageBox({
    type: 'warning',
    buttons: ['Continue', 'Abort'],
    message: 'Directory not found!',
    detail: `Unable to locate the directory "${dir}". This folder may have been deleted, removed or taken offline. Continue without saving to this directory?`
  })).response,
  startOverAlert: async () => (await remote.dialog.showMessageBox({
    type: 'warning',
    buttons: ['OK', 'Cancel'],
    message: 'Clear form and start over?'
  })).response,
  deleteDirectoryAlert: async label => (await remote.dialog.showMessageBox({
    type: 'warning',
    buttons: ['OK', 'Cancel'],
    message: `Delete ${label ? `"${label}"` : 'directory'}?`
  })).response,
  chooseDirectory: async () => {
    const { filePaths, canceled } = await remote.dialog.showOpenDialog({
      buttonLabel: 'Choose',
      properties: ['openDirectory', 'createDirectory']
    })

    return {
      filePaths,
      canceled
    }
  }
})

// ------ MISC ------

interop.setContextMenu = setContextMenu

interop.getExtName = file => path.extname(file).toLowerCase()

interop.getVersion = () => remote.app.getVersion()

interop.closeCurrentWindow = () => {
  remote.getCurrentWindow().close()
}

interop.screenRecorder = Object.freeze({
  start: startRecording,
  stop: stopRecording
})

interop.isMac = process.platform === 'darwin'

interop.checkIfDirectoryExists = async dir =>
  ipcRenderer.invoke('checkIfDirectoryExists', dir)

window.ABLE2 = Object.freeze({
  interop: Object.freeze(interop)
})
