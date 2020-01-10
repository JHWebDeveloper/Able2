import path from 'path'
import ffmpeg from '../utilities/ffmpeg'
import { checkIsImage, base64Encode, placeholder } from '../utilities/handleImages'

const round = (n, dec = 2) => Number(`${Math.round(`${n}e${dec}`)}e-${dec}`)

const getFileFormat = (file, tempFilePath, thumbnail) => new Promise((resolve, reject) => {
  const isImage = checkIsImage(tempFilePath)

  ffmpeg(tempFilePath).ffprobe((err1, metadata) => {
    if (err1) reject(err1) 

    try {
      const { duration, width, height, avg_frame_rate } = metadata.streams[0]
  
      resolve({
        readyStatus: `${isImage ? 'IMG' : 'VID'}_READY`,
        title: path.parse(file.name).name,
        width,
        height,
        ...(isImage ? {
          thumbnail: base64Encode(file.path)
        } : {
          thumbnail: thumbnail ? base64Encode(thumbnail) : placeholder,
          duration: Math.round(duration || 0),
          fps: (() => {
            const arr = avg_frame_rate.split('/')
            return round(arr[0] / arr[1])
          })()
        })
      })
    } catch (err2) {
      reject(err2)
    }
  })
})

export default getFileFormat
