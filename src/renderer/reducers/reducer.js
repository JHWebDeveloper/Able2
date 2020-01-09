import * as ACTION from '../actions/types'
import { DOWNLOADING, RENDERING } from '../status/types'
import { initState } from '../store/formStore'

export default (state, action) => {
  const { type, payload } = action

  switch (type) {
    case ACTION.UPDATE_STATE:
      return {
        ...state,
        ...payload
      }
    case ACTION.CHANGE_STATUS:
      return {
        ...state,
        status: payload
      }
    case ACTION.SET_RECORDING:
      return {
        ...state,
        recording: payload
      }
    case ACTION.UPDATE_THUMBNAIL:
      return {
        ...state,
        vidData: {
          ...state.vidData,
          thumbnail: payload
        }
      }
    case ACTION.ENABLE_TIMECODE:
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          enabled: payload.enabled
        }
      }
    case ACTION.UPDATE_TIMECODE:
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          display: payload.display,
          tc: payload.tc
        }
      }
    case ACTION.CHANGE_RADIO_VALUE:
      return {
        ...state,
        [payload.name]: payload.value
      }
    case ACTION.TOGGLE_CHECKBOX:
      return {
        ...state,
        [payload]: !state[payload]
      }
    case ACTION.CHECK_DIRECTORY:
      return {
        ...state,
        directories: state.directories.map(dir => {
          if (dir.id === payload) dir.checked = !dir.checked
          return dir
        })
      }
    case ACTION.DOWNLOAD_STARTED:
      return {
        ...state,
        status: DOWNLOADING,
        downloadProgress: initState.downloadProgress
      }
    case ACTION.RENDER_STARTED:
      return {
        ...state,
        status: RENDERING,
        renderProgress: initState.renderProgress
      }
    case ACTION.UPDATE_PROGRESS:
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          ...payload.progress
        }
      }
    case ACTION.RESET_FORM:
      return {
        ...state,
        ...initState
      }
    default:
      return state
  }
}
