import { loadVideoInfo } from './loadVideoInfo'
import { tcToSeconds } from '../../utilities'

import * as ACTION from '../types'
import * as STATUS from '../../status/types'

const { interop } = window.ABLE2

export const { submitForm } = require('./submitForm')

export const mergePreferences = prefs => ({
  type: ACTION.UPDATE_STATE,
  payload: prefs
})

export const loading = () => ({
  type: ACTION.CHANGE_STATUS,
  payload: STATUS.LOADING
})

export const getURLInfo = ({ url, end, renderOutput }) => async dispatch => {
  try {
    const info = await interop.getURLInfo({ url, renderOutput })
    loadVideoInfo(info, end, dispatch)
  } catch (err) {
    dispatch({
      type: ACTION.CHANGE_STATUS,
      payload: STATUS.FETCH_ERROR
    })
  }
}

export const uploadFile = (files, end) => async dispatch => {
  try {
    const info = await interop.uploadFile(files)
    loadVideoInfo(info, end, dispatch)
  } catch (err) {
    dispatch({
      type: ACTION.CHANGE_STATUS,
      payload: STATUS.UPLOAD_ERROR
    })
  }
}

export const setFileError = () => ({
  type: ACTION.CHANGE_STATUS,
  payload: STATUS.FILE_ERROR
})

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
  e.preventDefault()

  navigator.clipboard
    .readText()
    .then(txt => {
      dispatch(updateTimecode(name, txt.replace(/[^:;0-9]/g, '')))
    })
}

export const changeRadioValue = e => ({
  type: ACTION.CHANGE_RADIO_VALUE,
  payload: {
    name: e.target.name,
    value: e.target.value
  }
})

export const toggleCheckbox = e => ({
  type: ACTION.TOGGLE_CHECKBOX,
  payload: e.target.name
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

export const resetForm = warn => async dispatch => {
  const response = warn
    ? await interop.dialog.startOverAlert()
    : 0

  if (response !== 0) return false

  await interop.clearTempFiles()

  dispatch({
    type: ACTION.RESET_FORM
  })
}

export const setRecording = recording => ({
  type: ACTION.SET_RECORDING,
  payload: recording
})

export const setRecordingError = () => ({
  type: ACTION.CHANGE_STATUS,
  payload: STATUS.RECORDING_ERROR
})
