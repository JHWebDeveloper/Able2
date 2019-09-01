export default (state, action) => {
  const { type, payload } = action

  switch(type) {
    case 'UPDATE_STATE':
      return {
        ...state,
        ...payload
      }
    case 'CHANGE_STATUS':
      return {
        ...state,
        status: payload
      }
    case 'START_RECORDING':
      return {
        ...state,
        recording: true
      }
    case 'STOP_RECORDING':
      return {
        ...state,
        recording: false
      }
    case 'UPDATE_THUMBNAIL':
      return {
        ...state,
        vidData: {
          ...state.vidData,
          thumbnail: payload
        }
      }
    case 'ENABLE_TIMECODE':
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          enabled: payload.enabled
        }
      }
    case 'UPDATE_TIMECODE':
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          display: payload.display,
          tc: payload.tc
        }
      }
    case 'CHANGE_RADIO_VALUE':
      return {
        ...state,
        [payload.name]: payload.value
      }
    case 'TOGGLE_CHECKBOX':
      return {
        ...state,
        [payload]: !state[payload]
      }
    case 'CHECK_DIRECTORY':
      return {
        ...state,
        directories: state.directories.map(dir => {
          if (dir.id === payload) dir.checked = !dir.checked;
          return dir;
        })
      }
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          ...payload.progress
        }
      }
    case 'ADD_DIRECTORY':
      state.directories.splice(payload.pos, 0, payload.newDir)
      
      return {
        ...state,
        directories: state.directories
      }
    case 'DELETE_DIRECTORY':
      return {
        ...state,
        directories: state.directories.filter(dir => dir.id !== payload)
      }
    case 'UPDATE_LABEL':
      return {
        ...state,
        directories: state.directories.map(dir => (
          payload.id !== dir.id ? dir : {
            ...dir,
            label: payload.label
          }
        ))
      }
    case 'CHOOSE_DIRECTORY':
      return {
        ...state,
        directories: state.directories.map(dir => (
          payload.id !== dir.id ? dir : {
            ...dir,
            directory: payload.directory
          }
        ))
      }
    case 'MOVE_DIRECTORY':
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