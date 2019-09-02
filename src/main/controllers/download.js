const { spawn } = require('child_process')
const ytdlStatic = require('youtube-dl-ffmpeg-ffprobe-static')
const ffmpegStatic = require('ffmpeg-static-electron')
const { fixPathForAsarUnpack } = require('electron-util')

const getDownloadFormat = require('./getDownloadFormat')
const format = require('./format')
const { tempDir } = require('./handleExtFiles')

const parseYTDL = (str, regex) => {
  const result = str.match(regex);
  return result ? result[0] : false
}

const download = (evt, { formData }) => {
  let { url, fileName, optimize, renderOutput } = formData

  const options = [
    url,
    '-r',
    '100m',
    '--ffmpeg-location',
    fixPathForAsarUnpack(ffmpegStatic.path),
    '-o',
    `${tempDir}/temp.${fileName}.%(ext)s`,
    '--restrict-filenames',
    ...getDownloadFormat(renderOutput.split('x')[1], optimize)
  ]

  const video = spawn(fixPathForAsarUnpack(ytdlStatic.path), options)

  const progress = {
    file: null,
    prc: '0%',
    speed: '0MB/s',
    size: '0MB',
    eta: '00:00'
  }

  video.stdout.on('data', data => {
    const info = data.toString()

    if (!/^(\r)?\[download\]/.test(info)) return

    progress.file  = parseYTDL(info, (/(?<=temp\/).*(\n)?$/)) || progress.file
    progress.prc   = parseYTDL(info, /[.0-9]+%/) || progress.prc
    progress.size  = parseYTDL(info, /[.0-9]+MiB/) || progress.size
    progress.speed = parseYTDL(info, /[.0-9]+MiB\/s/) || progress.speed
    progress.eta   = parseYTDL(info, /[:0-9]+$/) || progress.eta

    evt.reply('download-progress', progress)
  })

  video.on('close', code => {
    if (code !== null) format(evt, { formData })
  })

  video.stderr.on('data', data => {
    if (/^ERROR: Unable to download webpage/.test(data.toString())) {
      video.kill()
      evt.reply('download-error')
    }
  })

  video.on('error', () => evt.reply('download-error'))

  evt.reply('download-started')
}

module.exports = download