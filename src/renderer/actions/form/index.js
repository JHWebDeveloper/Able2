import { ipcRenderer } from 'electron'
import { loadVideoInfo } from './loadVideoInfo'
import { tcToSeconds } from '../../utilities'

import * as ACTION from '../types'
import { LOADING, FETCH_ERROR, UPLOAD_ERROR } from '../../status/types'

export const { submitForm } = require('./submitForm')

export const getURLInfo = ({ url, end, renderOutput }) => dispatch => {
  dispatch({
    type: ACTION.CHANGE_STATUS,
    payload: LOADING
  })

  ipcRenderer.send('get-url-info', { url, renderOutput })

  ipcRenderer.once('info-retrieved', (evt, info) => {
    ipcRenderer.removeAllListeners(['url-error'])
    loadVideoInfo(info, end, dispatch)
  })

  ipcRenderer.once('url-error', () => {
    ipcRenderer.removeAllListeners(['info-retrieved'])

    dispatch({
      type: ACTION.CHANGE_STATUS,
      payload: FETCH_ERROR
    })
  })
}

export const getInfo = (files, end, message) => dispatch => {
  dispatch({
    type: ACTION.CHANGE_STATUS,
    payload: LOADING
  })

  ipcRenderer.send(message, files ? JSON.stringify(files) : false)

  ipcRenderer.once('info-retrieved', (evt, info) => {
    ipcRenderer.removeAllListeners(['upload-error'])
    loadVideoInfo(info, end, dispatch)
  })
  
  ipcRenderer.once('still-created', (evt, { thumbnail }) => {
    dispatch({
      type: ACTION.UPDATE_THUMBNAIL,
      payload: thumbnail
    })
  })

  ipcRenderer.once('upload-error', () => {
    ipcRenderer.removeAllListeners(['info-retrieved', 'still-created'])

    dispatch({
      type: ACTION.CHANGE_STATUS,
      payload: UPLOAD_ERROR
    })
  })
}

export const updateState = e => ({
  type: ACTION.UPDATE_STATE,
  payload: {
    [e.target.name]: e.target.value
  }
})

export const enableTimecode = (name, enabled) => ({
  type: ACTION.ENABLE_TIMECODE,
  payload: {
    name,
    enabled: !enabled
  }
})

export const updateTimecode = (name, tc) => ({
  type: ACTION.UPDATE_TIMECODE,
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
  type: ACTION.CHANGE_RADIO_VALUE,
  payload: {
    name: target.name,
    value: target.value
  }
})

export const toggleCheckbox = ({ target }) => ({
  type: ACTION.TOGGLE_CHECKBOX,
  payload: target.name
})

export const checkDirectory = id => ({
  type: ACTION.CHECK_DIRECTORY,
  payload: id
})

export const updateProgress = (name, progress) => ({
  type: ACTION.UPDATE_PROGRESS,
  payload: {
    name: `${name}Progress`,
    progress
  }
})

export const syncPreferences = prefs => ({
  type: ACTION.UPDATE_STATE,
  payload: prefs
})