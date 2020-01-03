import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import uuidv1 from 'uuid/v1'

const dev = process.env.NODE_ENV === 'development'

export const prefsDir = dev 
  ? path.join('.', 'data')
  : path.join(app.getPath('appData'), 'able2', 'prefs')

export const tempDir = dev 
  ? path.join('.', 'temp')
  : path.join(app.getPath('temp'), 'able2')

export const initDirectories = () => {
  if (!fs.existsSync(prefsDir)) {
    fs.mkdirSync(prefsDir)
    fs.writeFileSync(path.join(prefsDir, 'preferences.json'), JSON.stringify({
      directories: [
        {
          checked: true,
          directory: app.getPath('desktop'),
          id: uuidv1(),
          label: "Save to Desktop"
        }
      ],
      renderOutput: "1280x720"
    }, 'utf8', err => { if (err) throw err }))
  }

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
}

export const clearTempFiles = () => (
  fs.promises.readdir(tempDir).then(files => (
    files.forEach(file => (
      fs.promises.unlink(path.join(tempDir, file)).catch(err => { throw err })
    ))
  )).catch(err => { throw err })
)

export const copyToDirectories = (dirs, tempFile, newFile) => {
  dirs
    .filter(dir => dir.checked)
    .forEach(dir => {
      fs.promises.copyFile(
        path.join(tempDir, tempFile),
        path.join(dir.directory, newFile || tempFile),
      ).catch(err => { throw err })
    })
}
