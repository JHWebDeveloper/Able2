import * as ACTION from '../actions/types'

export default (state, action) => {
  const { type, payload } = action
  let trgtDir = false

  switch (type) {
    case ACTION.LOAD_PREFS:
      return {
        ...state,
        ...payload
      }
    case ACTION.TOGGLE_CHECKBOX:
      return {
        ...state,
        [payload]: !state[payload]
      }
    case ACTION.CHANGE_RADIO_VALUE:
      return {
        ...state,
        [payload.name]: payload.value
      }
    case ACTION.CHECK_DIRECTORY:
      return {
        ...state,
        directories: state.directories.map(dir => {
          if (dir.id === payload) dir.checked = !dir.checked
          return dir
        })
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
      trgtDir = state.directories.splice(payload.oldPos, 1)[0]

      state.directories.splice(payload.newPos, 0, trgtDir)

      return {
        ...state,
        directories: state.directories
      }
    default:
      return state
  }
}
