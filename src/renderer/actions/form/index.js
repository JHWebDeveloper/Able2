import { ipcRenderer, remote } from 'electron'
import { loadVideoInfo } from './loadVideoInfo'
import { tcToSeconds } from '../../utilities'

export const { submitForm } = require('./submitForm')

export const getURLInfo = ({ url, end, renderOutput }) => dispatch => {
  dispatch({
    type: 'CHANGE_STATUS',
    payload: 'LOADING'
  })

  ipcRenderer.send('get-info', { url, renderOutput })

  ipcRenderer.once('info-retrieved', (evt, info) => {
    ipcRenderer.removeAllListeners(['url-error'])
    loadVideoInfo(info, end, dispatch)
  })

  ipcRenderer.once('url-error', () => {
    ipcRenderer.removeAllListeners(['info-retrieved'])

    dispatch({
      type: 'CHANGE_STATUS',
      payload: 'FETCH_ERROR'
    })
  })
}

export const getInfo = (file, end, message) => dispatch => {
  const { name, path } = file

  dispatch({
    type: 'CHANGE_STATUS',
    payload: 'LOADING'
  })

  ipcRenderer.send(message, file ? { name, path } : false)

  ipcRenderer.once('info-retrieved', (evt, info) => {
    ipcRenderer.removeAllListeners(['upload-error'])
    loadVideoInfo(info, end, dispatch)
  })
  
  ipcRenderer.once('still-created', (evt, { thumbnail }) => {
    dispatch({
      type: 'UPDATE_THUMBNAIL',
      payload: thumbnail
    })
  })

  ipcRenderer.once('upload-error', () => {
    ipcRenderer.removeAllListeners(['info-retrieved', 'still-created'])

    dispatch({
      type: 'CHANGE_STATUS',
      payload: 'UPLOAD_ERROR'
    })
  })
}

export const updateState = e => ({
  type: 'UPDATE_STATE',
  payload: {
    [e.target.name]: e.target.value
  }
})

export const enableTimecode = (name, enabled) => ({
  type: 'ENABLE_TIMECODE',
  payload: {
    name,
    enabled: !enabled
  }
})

export const updateTimecode = (name, tc) => ({
  type: 'UPDATE_TIMECODE',
  payload: {
    name,
    display: tc,
    tc: tcToSeconds(tc)
  }
})

export const pasteTimecode = (name, e) => dispatch => {
  e.preventDefault();

  navigator.clipboard
    .readText()
    .then(txt => {
      dispatch(updateTimecode(name, txt.replace(/[^:;0-9]/g, '')))
    })
}

export const changeRadioValue = ({ target }) => ({
  type: 'CHANGE_RADIO_VALUE',
  payload: {
    name: target.name,
    value: target.value
  }
})

export const toggleCheckbox = ({ target }) => ({
  type: 'TOGGLE_CHECKBOX',
  payload: target.name
})

export const checkDirectory = id => ({
  type: 'CHECK_DIRECTORY',
  payload: id
})

export const updateProgress = (name, progress) => ({
  type: 'UPDATE_PROGRESS',
  payload: {
    name: `${name}Progress`,
    progress
  }
})

export const syncPreferences = prefs => ({
  type: 'UPDATE_STATE',
  payload: prefs
})