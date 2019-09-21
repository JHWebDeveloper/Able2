import * as ACTION from '../actions/types'

export default (state, action) => {
  const { type, payload } = action

  switch(type) {
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
    case ACTION.START_RECORDING:
      return {
        ...state,
        recording: true
      }
    case ACTION.STOP_RECORDING:
      return {
        ...state,
        recording: false
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
          if (dir.id === payload) dir.checked = !dir.checked;
          return dir;
        })
      }
    case ACTION.UPDATE_PROGRESS:
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          ...payload.progress
        }
      }
    case ACTION.ADD_DIRECTORY:
      state.directories.splice(payload.pos, 0, payload.newDir)
      
      return {
        ...state,
        directories: state.directories
      }
    case ACTION.DELETE_DIRECTORY:
      return {
        ...state,
        directories: state.directories.filter(dir => dir.id !== payload)
      }
    case ACTION.UPDATE_LABEL:
      return {
        ...state,
        directories: state.directories.map(dir => (
          payload.id !== dir.id ? dir : {
            ...dir,
            label: payload.label
          }
        ))
      }
    case ACTION.CHOOSE_DIRECTORY:
      return {
        ...state,
        directories: state.directories.map(dir => (
          payload.id !== dir.id ? dir : {
            ...dir,
            directory: payload.directory
          }
        ))
      }
    case ACTION.MOVE_DIRECTORY:
      const trgtDir = state.directories.splice(payload.oldPos, 1)[0];

      state.directories.splice(payload.newPos, 0, trgtDir);

      return {
        ...state,
        directories: state.directories
      }
    default:
      return state;
  }
}