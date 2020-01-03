import { promises as fsp } from 'fs'
import path from 'path'
import { prefsDir } from './handleExtFiles'

const prefs = path.join(prefsDir, 'preferences.json')

export const loadPrefs = evt => {
  fsp.readFile(prefs)
    .then(data => {
      evt.reply('prefs-retrieved', JSON.parse(data))
    })
}

export const savePrefs = (evt, newPrefs, mainWin) => {
  fsp.writeFile(
    prefs,
    JSON.stringify(newPrefs),
    err => { if (err) throw err; }
  ).then(() => {
    evt.reply('prefs-saved')
    mainWin.webContents.send('sync-prefs', newPrefs)
  })
}
