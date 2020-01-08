import uuidv1 from 'uuid/v1'
import { checkDirectory } from '../form';

import {
  LOAD_PREFS,
  ADD_DIRECTORY,
  DELETE_DIRECTORY,
  UPDATE_LABEL,
  CHOOSE_DIRECTORY,
} from '../types'

const { interop } = window.ABLE2

export const loadPrefs = async () => {
  try {    
    return ({
      type: LOAD_PREFS,
      payload: await interop.requestPrefs()
    })
  } catch (err) {
    console.error(err)
  }
}

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

export const deleteDirectoryWarn = (id, label) => async dispatch => {
  const response = await interop.dialog.deleteDirectoryAlert(label)

  if (response === 0) dispatch(deleteDirectory(id))
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

export const chooseDirectory = id => async dispatch => {
  const { filePaths, canceled } = await interop.dialog.chooseDirectory()

  if (canceled) return false

  dispatch({
    type: CHOOSE_DIRECTORY,
    payload: {
      id,
      directory: filePaths[0]
    }
  })
}

export const savePreferences = (prefs, callback) => async dispatch => {
  prefs.directories = prefs.directories
    .filter(dir => dir.directory)
    .map(dir => dir.label ? dir : {
      ...dir,
      label: dir.directory.split('/').pop()
    })

  try {
    await interop.savePrefs(prefs)

    dispatch({
      type: LOAD_PREFS,
      payload: prefs
    })

    callback(false)
  } catch (err) {
    console.error(err)
  }

}

export const syncPreferences = newPrefs => ({
  type: LOAD_PREFS,
  payload: newPrefs
})
