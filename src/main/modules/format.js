import fs from 'fs'
import path from 'path'
import ffmpeg from './ffmpeg'
import { tempDir, copyToDirectories, clearTempFiles } from './handleExtFiles'
import { checkIsImage, checkIsGIF } from './checkIsImage'
import render from './render'

let fileCount = 0
let fileQueue = []

const zeroize = n => n < 10 ? `0${n}` : n

const format = (evt, formData, file) => {
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
      )

      if (fileCount === fileQueue.length - 1) {
        fileCount = 0
        fileQueue = []
        evt.reply('render-complete')
      } else {
        fileCount += 1
        format(evt, formData, fileQueue[fileCount])
      }
    })
    .on('progress', prog => {
      evt.reply('render-progress', {
         prc: prog.percent,
         timemark: prog.timemark,
         frames: prog.frames,
         fileCount: fileCount + 1,
         fileTotal: fileQueue.length
      })
    })
    .on('error', () => {
      clearTempFiles()
      evt.reply('render-error')
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

  render(formData, command, file)
}

const getTempFile = (evt, { formData }) => {
  evt.reply('render-started')
  
  fs.promises.readdir(tempDir).then(files => {
    fileQueue = files.filter(file => (
      file.startsWith('temp.')
    ))

    format(evt, formData, fileQueue[fileCount])
  }).catch(err => { throw err })
}

export default getTempFile
