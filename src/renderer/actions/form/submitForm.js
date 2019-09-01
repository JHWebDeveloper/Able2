import fs from 'fs'
import { ipcRenderer, remote } from 'electron'
import { updateProgress } from '../form' 
import buildSource from './buildSource';
import { cleanSourceName, cleanFileName } from '../../utilities';

const dirAlert = dir => remote.dialog.showMessageBoxSync({
  type: 'warning',
  buttons: ['Continue', 'Abort'],
  message: `Unable to locate the directory "${dir}". This folder may have been deleted, removed or taken offline. Continue without saving to this directory?`
})

export const submitForm = (state, e) => dispatch => {
  e.preventDefault()

  let { fileName, source, sourcePrefix, renderOutput, directories } = state

  if (directories.every(dir => !dir.checked)) {
    const filePath = remote.dialog.showOpenDialogSync({
      buttonLabel: 'Choose',
      properties: ['openDirectory', 'createDirectory']
    })

    if (!filePath) return

    state.directories.push({
      checked: true,
      directory: filePath[0]
    })
  } else {
    for (let dir of directories) {
      if (dir.checked && !fs.existsSync(dir.directory) && dirAlert(dir.directory)) return
    }
  }

  if (source) source = cleanSourceName(source)

  ipcRenderer.once('download-started', () => {
    dispatch({
      type: 'CHANGE_STATUS',
      payload: 'DOWNLOADING'
    })
  })

  ipcRenderer.on('download-progress', (evt, progress) => {
    dispatch(updateProgress('download', progress))
  })

  ipcRenderer.once('download-error', () => {
    ipcRenderer.removeAllListeners([
      'download-progress',
      'render-started',
      'render-progress',
      'render-error',
      'render-complete'
    ])

    dispatch({
      type: 'CHANGE_STATUS',
      payload: 'DOWNLOAD_ERROR'
    })
  })

  ipcRenderer.once('render-started', () => {
    ipcRenderer.removeAllListeners(['download-progress', 'download-error'])

    dispatch({
      type: 'CHANGE_STATUS',
      payload: 'RENDERING'
    })
  })

  ipcRenderer.on('render-progress', (evt, progress) => {
    dispatch(updateProgress('render', progress))
  })

  ipcRenderer.once('render-error', () => {
    ipcRenderer.removeAllListeners(['render-progress', 'render-complete'])

    dispatch({
      type: 'CHANGE_STATUS',
      payload: 'RENDER_ERROR'
    })
  })

  ipcRenderer.once('render-complete', () => {
    ipcRenderer.removeAllListeners(['render-progress', 'render-error'])
    
    dispatch({
      type: 'CHANGE_STATUS',
      payload: 'DONE'
    })
  })

  ipcRenderer.send(state.status === 'URL_READY' ? 'download' : 'format', {
    formData: {
      ...state,
      fileName: cleanFileName(fileName),
      sourceDataURL: source
        ? buildSource(sourcePrefix ? `Source: ${source}` : source, renderOutput)
        : false
    }
  })
}