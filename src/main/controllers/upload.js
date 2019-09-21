const fs = require('fs').promises
const path = require('path')
const getFileInfo = require('./getFileInfo')
const { tempDir } = require('./handleExtFiles')

const tempFileName = ({ name }) => path.join(tempDir, `temp.${name}`)

const upload = (evt, data) => {
  const files = JSON.parse(data)

  if (files.length > 1) {
    files.forEach(file => {
      fs.copyFile(file.path, tempFileName(file)).catch(err => { throw err }) 
    })

    evt.reply('info-retrieved', {
      readyStatus: 'BATCH_READY',
      title: 'Batch Process',
      fileCount: files.length
    })
  } else {    
    const tempFile = tempFileName(files[0])
  
    fs.copyFile(files[0].path, tempFile).then(() => {
      getFileInfo(evt, files[0], tempFile)
    }).catch(err => { throw err }) 
  }
}

module.exports = upload