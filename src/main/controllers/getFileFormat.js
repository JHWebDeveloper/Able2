const fs = require('fs')
const path = require('path')
const uuidv1 = require('uuid/v1')
const ffmpeg = require('./ffmpeg')
const { tempDir } = require('./handleExtFiles')
const { checkIsImage } = require('./checkIsImage')

const base64_encode = file => `data:image/png;base64,${fs.readFileSync(file, 'base64')}`
const round = (n, dec = 2) => Number(Math.round(n+'e'+dec)+'e-'+dec)

const getFileFormat = (evt, file, tempFile) => {
  const isImage = checkIsImage(tempFile)
  const screenshot = `screenshot.${uuidv1()}.jpg`

  const watcher = fs.watch(tempDir)
  
  watcher.on('change', (eventType, eventFile) => {
    if (eventFile === screenshot) {
      if (!isImage) evt.reply('still-created', {
        thumbnail: base64_encode(path.join(tempDir, eventFile))
      })
      watcher.close()
    }
  })

  watcher.on('error', () => watcher.close())

  ffmpeg(tempFile).screenshots({
    timemarks: [0],
    folder: tempDir,
    filename: screenshot,
    size: '384x?'
  }).ffprobe((err, metadata) => {
    const { duration, width, height, r_frame_rate } = metadata.streams[0]

    evt.reply('info-retrieved', {
      readyStatus: `${isImage ? 'IMG' : 'VID'}_READY`,
      title: path.parse(file.name).name,
      width,
      height,
      ...(isImage ? {
        thumbnail: base64_encode(file.path),
      } : {
        duration: Math.round(duration || 0),
        fps: (() => {
          const arr = r_frame_rate.split('/')
          return round(arr[0] / arr[1])
        })()
      })
    })
  })
}

module.exports = getFileFormat