import { remote } from 'electron'
import { ipcRenderer } from 'electron'
import uuidv1 from 'uuid/v1'
import { checkDirectory } from '../form';

import {
  ADD_DIRECTORY,
  DELETE_DIRECTORY,
  UPDATE_LABEL,
  CHOOSE_DIRECTORY,
  UPDATE_STATE
} from '../types'

export const checkDefault = checkDirectory

const addDirectory = dir => ({
  type: ADD_DIRECTORY,
  payload: dir
})

export const addNewDirectory = (index, e) => dispatch => {
  const pos = e.shiftKey ? 1 : 0

  dispatch(addDirectory({
    pos: index + pos,
    newDir: {
      id: uuidv1(),
      checked: false,
      label: '',
      directory: ''
    }
  }))
}

const deleteDirectory = id => ({
  type: DELETE_DIRECTORY,
  payload: id
})

export const deleteDirectoryWarn = (id, label) => dispatch => {
  remote.dialog.showMessageBox({
    buttons: ['OK', 'Cancel'],
    message: `Delete ${label ? `"${label}"` : 'directory'}?`
  }, res => {
    if (!res) dispatch(deleteDirectory(id))
  })
}

export const moveDirectory = (newDir, pos) => dispatch => {
  dispatch(deleteDirectory(newDir.id))
  setTimeout(() => {
    dispatch(addDirectory({ pos, newDir }))
  }, 300)
}

export const updateLabel = (id, e) => ({
  type: UPDATE_LABEL,
  payload: {
    id,
    label: e.target.value
  }
})

export const chooseDirectory = id => dispatch => {
  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    buttonLabel: 'Choose',
    properties: ['openDirectory', 'createDirectory']
  }).then(({ filePaths }) => {
    dispatch({
      type: CHOOSE_DIRECTORY,
      payload: {
        id,
        directory: filePaths[0]
      }
    })
  })
}

export const savePreferences = prefs => dispatch => {
  prefs.directories = prefs.directories
    .filter(dir => dir.directory)
    .map(dir => dir.label ? dir : {
      ...dir,
      label: dir.directory.split('/').pop()
    })

  ipcRenderer.send('save-prefs', prefs)

  dispatch({
    type: UPDATE_STATE,
    payload: prefs
  })
}

export const updatePreferences = prefs => ({

})

export const closePreferences = () => {
  remote.getCurrentWindow().close()
}