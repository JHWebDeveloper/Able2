import { ipcMain } from 'electron'
import fs, { promises as fsp } from 'fs'
import path from 'path'
import ffmpeg from '../utilities/ffmpeg'
import { tempDir, copyToDirectories } from '../utilities/handleExtFiles'
import { checkIsImage, checkIsGIF } from '../utilities/handleImages'
import render from './render'

let fileCount = 0
let fileQueue = []

const zeroize = n => n < 10 ? `0${n}` : n

const format = (formData, file, win) => new Promise((resolve, reject) => {
  const { fileName, start, end, arc, bg, source, directories, status } = formData

  const formatted = [
    'formatted',
    `${fileName}${status === 'BATCH_READY' ? `_${zeroize(fileCount + 1)}` : ''}`,
    bg === 'alpha' ? 'mov' : 'mp4'
  ].join('.')

  const original = path.join(tempDir, file)

  const command = ffmpeg(original)
    .outputOptions(arc === 'fit' && bg === 'alpha' ? [
      '-vcodec prores_ks',
      '-pix_fmt yuva444p10le',
      '-profile:v 4444',
      '-preset:v ultrafast'
    ] : [
      '-vcodec h264',
      '-b:v 7000k',
      '-b:a 192k',
      '-crf 17',
      '-preset:v ultrafast'
    ])
    .on('end', () => {
      copyToDirectories(
        directories,
        formatted,
        formatted.replace(/^formatted\./, '')
      ).then(() => {
        if (fileCount === fileQueue.length - 1) {
          fileCount = 0
          fileQueue = []
          resolve()
        } else {
          fileCount += 1
          format(formData, fileQueue[fileCount], win).then(resolve)
        }
      })
      .catch(reject)
      .finally(() => {
        ipcMain.removeAllListeners(['cancelProcess'])
        win.setProgressBar(-1)
      })
    })
    .on('progress', prog => {
      win.webContents.send('renderProgress', {
        prc: prog.percent,
        timemark: prog.timemark,
        frames: prog.frames,
        fileCount: fileCount + 1,
        fileTotal: fileQueue.length
      })

      win.setProgressBar(prog.percent / 100)
    })
    .on('error', err => {
      win.setProgressBar(-1)
      reject(err)
    })
    .output(path.join(tempDir, formatted))

  if (start.enabled) command.seekInput(start.tc)
  if (end.enabled)   command.duration(start.enabled ? end.tc - start.tc : end.tc)
  if (checkIsImage(file) && !checkIsGIF(file)) command.loop(7)

  if (source) {
    const srcPNG = path.join(tempDir, 'source.png')

    fs.writeFileSync(srcPNG,
      Buffer.from(formData.sourceDataURL, 'base64'),
      err => { if (err) throw err }
    )
    command.input(srcPNG).native()
  }

  ipcMain.once('cancelProcess', () => {
    command.kill()
    win.setProgressBar(-1)
    reject('canceled')
  })

  render(formData, command)
})

const getTempFile = async (formData, win) => {
  win.webContents.send('renderStarted')
  win.setProgressBar(0)
  
  const files = await fsp.readdir(tempDir)

  fileQueue = files.filter(file => file.startsWith('temp.'))

  return format(formData, fileQueue[fileCount], win)
}

export default getTempFile
