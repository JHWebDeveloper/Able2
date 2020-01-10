import { ipcMain } from 'electron'
import { spawn } from 'child_process'
import ytdlStatic from 'youtube-dl-ffmpeg-ffprobe-static'
import ffmpegStatic from 'ffmpeg-static-electron'
import { fixPathForAsarUnpack } from 'electron-util'

import getDownloadFormat from '../utilities/getDownloadFormat'
import { tempDir } from '../utilities/handleExtFiles'

const parseYTDL = (str, regex) => {
  const result = str.match(regex)
  return result ? result[0] : false
}

const download = (formData, win) => new Promise((resolve, reject) => {
  const { url, fileName, optimize, renderOutput } = formData

  const options = [
    url,
    '-r',
    '12500k',
    '--ffmpeg-location',
    fixPathForAsarUnpack(ffmpegStatic.path),
    '-o',
    `${tempDir}/temp.${fileName}.%(ext)s`,
    '--restrict-filenames',
    ...getDownloadFormat(renderOutput.split('x')[1], optimize)
  ]

  const video = spawn(fixPathForAsarUnpack(ytdlStatic.path), options)

  const progress = {
    file: false,
    prc: '0%',
    speed: '0MB/s',
    size: '0MB',
    eta: '00:00'
  }

  video.stdout.on('data', data => {
    const info = data.toString()

    if (!/^(\r)?\[download\]/.test(info)) return

    progress.file  = parseYTDL(info, (/(?<=temp\.).*(\n)?$/)) || progress.file
    progress.prc   = parseYTDL(info, /[.0-9]+%/) || progress.prc
    progress.size  = parseYTDL(info, /[.0-9]+MiB/) || progress.size
    progress.speed = parseYTDL(info, /[.0-9]+MiB\/s/) || progress.speed
    progress.eta   = parseYTDL(info, /[:0-9]+$/) || progress.eta

    win.webContents.send('downloadProgress', progress)
    win.setProgressBar(parseInt(progress.prc) / 100)
  })

  video.on('close', code => {
    if (code === null) return
    ipcMain.removeAllListeners(['cancelProcess'])
    win.setProgressBar(-1)
    resolve()
  })

  video.stderr.on('data', data => {
    const err = data.toString()

    if (/^ERROR: Unable to download webpage/.test(err)) {
      video.kill()
      win.setProgressBar(-1)
      reject(err)
    }
  })

  video.on('error', err => {
    win.setProgressBar(-1)
    reject(err)
  })

  ipcMain.once('cancelProcess', () => {
    video.kill()
    win.setProgressBar(-1)
    reject('canceled')
  })

  win.webContents.send('downloadStarted')
  win.setProgressBar(0)
})

export default download
