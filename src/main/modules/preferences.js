import { app } from 'electron'
import { promises as fsp } from 'fs'
import path from 'path'
import uuidv1 from 'uuid/v1'
import { prefsDir } from './handleExtFiles'
import fileExistsPromise from './fileExistsPromise'

const prefs = path.join(prefsDir, 'preferences.json')

const initPrefs = {
  renderOutput: '1280x720',
  sourceOnTopWarning: true,
  directories: [
    {
      checked: true,
      directory: app.getPath('desktop'),
      id: uuidv1(),
      label: 'Save to Desktop'
    }
  ]
}

export const loadPrefs = async () => {
  if (await fileExistsPromise(prefs)) {
    return JSON.parse(await fsp.readFile(prefs))
  } else {
    await fsp.writeFile(prefs, JSON.stringify(initPrefs))
    
    return initPrefs
  }
}

export const savePrefs = async newPrefs => fsp.writeFile(prefs, JSON.stringify(newPrefs))
