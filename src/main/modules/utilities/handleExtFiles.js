import { promises as fsp } from 'fs'
import path from 'path'
import { app } from 'electron'
import fileExistsPromise from './fileExistsPromise'

const dev = process.env.NODE_ENV === 'development'

export const prefsDir = dev 
  ? path.join('.', 'data')
  : path.join(app.getPath('appData'), 'able2', 'prefs')

export const tempDir = dev 
  ? path.resolve(__dirname, '..', '..', 'temp')
  : path.join(app.getPath('temp'), 'able2')

export const initTempDirectory = async () => {
  if (!(await fileExistsPromise(tempDir))) fsp.mkdir(tempDir)
}

export const clearTempFiles = async () => {
  const files = await fsp.readdir(tempDir)

  return Promise.all(files.map(file => fsp.unlink(path.join(tempDir, file))))
}

export const copyToDirectories = (dirs, tempFile, newFile) => (
  Promise.all(dirs
    .filter(dir => dir.checked)
    .map(dir => fsp.copyFile(
      path.join(tempDir, tempFile),
      path.join(dir.directory, newFile || tempFile)
    ))
  )
)
