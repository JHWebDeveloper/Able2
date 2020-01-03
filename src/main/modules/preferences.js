const fs = require('fs').promises
const path = require('path')
const { prefsDir } = require('./handleExtFiles')
const prefs = path.join(prefsDir, 'preferences.json')

const loadPrefs = evt => {
  fs.readFile(prefs)
    .then(data => {
      evt.reply('prefs-retrieved', JSON.parse(data))
    })
}

const savePrefs = (evt, newPrefs, mainWin) => {
  fs.writeFile(
    prefs,
    JSON.stringify(newPrefs),
    err => { if (err) throw err; }
  ).then(() => {
    evt.reply('prefs-saved')
    mainWin.webContents.send('sync-prefs', newPrefs)
  })
}

module.exports = {
  loadPrefs,
  savePrefs
}