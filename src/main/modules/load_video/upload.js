import { promises as fsp } from 'fs'
import path from 'path'
import getFileInfo from './getFileInfo'
import { tempDir } from '../utilities/handleExtFiles'
import { createThumbnail, placeholder } from './createThumbnail'

const tempFileName = ({ name }) => path.join(tempDir, `temp.${name}`)

const upload = async files => {
  if (files.length > 1) {
    await Promise.all(files.map(file => fsp.copyFile(file.path, tempFileName(file))))

    return {
      readyStatus: 'BATCH_READY',
      title: 'Batch Process',
      fileCount: files.length,
      thumbnail: placeholder
    }
  } else {
    const file = files[0]
    const tempFilePath = tempFileName(file)

    if (tempFilePath !== file.path) {
      await fsp.copyFile(file.path, tempFilePath)
    }

    const thumbnail = await createThumbnail(tempFilePath)

    return getFileInfo(file, tempFilePath, thumbnail)
  }
}

export default upload
