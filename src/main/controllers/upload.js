const fs = require('fs')
const path = require('path')
const getFileFormat = require('./getFileFormat')
const { tempDir } = require('./handleExtFiles')

const upload = (evt, file) => {
  const tempFile = path.join(tempDir, `temp.${file.name}`)

  fs.promises.copyFile(file.path, tempFile).then(() => {
    getFileFormat(evt, file, tempFile)
  })
}

module.exports = upload