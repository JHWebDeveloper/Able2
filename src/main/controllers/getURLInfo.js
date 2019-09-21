const { spawn } = require('child_process')
const ytdlStatic = require('youtube-dl-ffmpeg-ffprobe-static')
const { fixPathForAsarUnpack } = require('electron-util')
const getDownloadFormat = require('./getDownloadFormat')

const info = (evt, { url, renderOutput }) => {
  const getVideoInfo = spawn(fixPathForAsarUnpack(ytdlStatic.path), [
    url,
    ...getDownloadFormat(renderOutput.split('x')[1]),
    '--dump-json'
  ])

  let infoString = ''

  getVideoInfo.stdout.on('data', data => infoString += data.toString())

  getVideoInfo.stderr.on('data', data => {
    if (/^ERROR: (Unsupported URL|No media found)/.test(data.toString())) {
      getVideoInfo.kill()
      evt.reply('url-error')
    }
  })

  getVideoInfo.on('close', code => {
    if (code === null) return

    const info = JSON.parse(infoString)
    let { title, thumbnail, width, height, fps } = info

    evt.reply('info-retrieved', {
      readyStatus: 'URL_READY',
      duration: Math.round(info.duration),
      isImage: false,
      title,
      width,
      height,
      thumbnail,
      fps
    })
  })

  getVideoInfo.on('error', () => {
    evt.reply('url-error')
  })
}

module.exports = info