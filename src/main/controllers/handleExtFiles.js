const fs = require('fs')
const path = require('path')
const { app } = require('electron')
const uuidv1 = require('uuid/v1')

const dev = process.env.NODE_ENV === 'development'

const prefsDir = dev 
  ? path.join('src', 'main', 'data')
  : path.join(app.getPath('appData'), 'able2', 'prefs')

const tempDir = dev 
  ? path.join('src', 'main', 'temp')
  : path.join(app.getPath('temp'), 'able2')

const initDirectories = () => {
  if (!fs.existsSync(prefsDir)) {
    fs.mkdirSync(prefsDir)
    fs.writeFileSync(path.join(prefsDir, 'preferences.json'), JSON.stringify({
      directories: [
        // {
        //   checked: true,
        //   directory: app.getPath('desktop'),
        //   id: uuidv1(),
        //   label: "Save to Desktop"
        // }
        {
          checked: true,
          directory: "//cmgorlpxaaspera/aspera_in",
          id: uuidv1(),
          label: "Send to Aspera"
        },
        {
          checked: false,
          directory: "K://News_Mugs",
          id: uuidv1(),
          label: "Save to News Mugs"
        },
        {
          checked: false,
          directory: "K://News_Mugs/FINAL MUGS",
          id: uuidv1(),
          label: "Save to Final Mugs"
        }
      ],
      renderOutput: "1280x720"
    }, 'utf8', err => { if (err) throw err }))
  }

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
}

const clearTempFiles = () => (
  fs.promises.readdir(tempDir).then(files => (
    files.forEach(file => (
      fs.promises.unlink(path.join(tempDir, file)).catch(err => { throw err })
    ))
  )).catch(err => { throw err })
)

const copyToDirectories = (dirs, tempFile, newFile) => {
  dirs
    .filter(dir => dir.checked)
    .forEach(dir => {
      fs.promises.copyFile(
        path.join(tempDir, tempFile),
        path.join(dir.directory, newFile || tempFile),
      ).catch(err => { throw err })
    })
}

module.exports = {
  prefsDir,
  tempDir,
  initDirectories,
  clearTempFiles,
  copyToDirectories
}