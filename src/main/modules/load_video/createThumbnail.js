
import path from 'path'
import uuidv1 from 'uuid/v1'

import ffmpeg from '../utilities/ffmpeg'
import { tempDir } from '../utilities/handleExtFiles'

export const createThumbnail = async tempFile => new Promise(resolve => {
  const screenshot = `screenshot.${uuidv1()}.jpg`

  ffmpeg(tempFile).on('end', () => {
    resolve(path.join(tempDir, screenshot))
  }).on('error', () => {
    resolve(false) // ignore error for thumbnails
  }).screenshots({
    timemarks: ['50%'],
    folder: tempDir,
    filename: screenshot,
    size: '384x?'
  })
})
