import { spawn } from 'child_process'
import ytdlStatic from 'youtube-dl-ffmpeg-ffprobe-static'
import { fixPathForAsarUnpack } from 'electron-util'
import getDownloadFormat from '../utilities/getDownloadFormat'
import { placeholder } from '../utilities/handleImages'

const info = ({ url, renderOutput }) => new Promise((resolve, reject) => {
  const getVideoInfo = spawn(fixPathForAsarUnpack(ytdlStatic.path), [
    url,
    ...getDownloadFormat(renderOutput.split('x')[1]),
    '--dump-json'
  ])

  let infoString = ''

  getVideoInfo.stdout.on('data', data => {
    infoString += data.toString()
  })

  getVideoInfo.stderr.on('data', err => {
    if (/^ERROR: (Unsupported URL|No media found)/.test(err.toString())) {
      getVideoInfo.kill()
      reject(err)
    }
  })

  getVideoInfo.on('close', code => {
    if (code === null) return

    const info = JSON.parse(infoString)
    const { title, thumbnail, width, height, fps } = info

    resolve({
      readyStatus: 'URL_READY',
      duration: Math.round(info.duration),
      isImage: false,
      thumbnail: thumbnail || placeholder,
      title,
      width,
      height,
      fps
    })
  })

  getVideoInfo.on('error', err => {
    reject(err)
  })
})

export default info