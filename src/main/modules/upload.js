import { promises as fsp } from 'fs'
import path from 'path'
import getFileInfo from './getFileInfo'
import { tempDir } from './handleExtFiles'

const tempFileName = ({ name }) => path.join(tempDir, `temp.${name}`)

const upload = (evt, data) => {
  const files = JSON.parse(data)

  if (files.length > 1) {
    files.forEach(file => {
      fsp.copyFile(file.path, tempFileName(file)).catch(err => { throw err }) 
    })

    evt.reply('info-retrieved', {
      readyStatus: 'BATCH_READY',
      title: 'Batch Process',
      fileCount: files.length
    })
  } else {    
    const tempFile = tempFileName(files[0])
  
    fsp.copyFile(files[0].path, tempFile).then(() => {
      getFileInfo(evt, files[0], tempFile)
    }).catch(err => { throw err }) 
  }
}

export default upload