const fs = require('fs')
const path = require('path')
const ffmpeg = require('./ffmpeg')
const { tempDir, copyToDirectories } = require('./handleExtFiles')
const render = require('./render')

const format = (evt, formData, file) => {
  const { fileName, start, end, arc, bg, source, directories, status } = formData

  const formatted = [
    'formatted',
    fileName,
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

      evt.reply('render-complete')
    })
    .on('progress', prog => {
      evt.reply('render-progress', {
         prc: prog.percent,
         timemark: prog.timemark,
         frames: prog.frames
      })
    })
    .on('error', () => {
      evt.reply('render-error')
    })
    .output(path.join(tempDir, formatted))

  if (start.enabled) command.seekInput(start.tc)
  if (end.enabled)   command.duration(start.enabled ? end.tc - start.tc : end.tc)
  if (status === 'IMG_READY' && path.extname(file) !== '.gif') command.loop(7)

  if (source) {
    const srcPNG = path.join(tempDir, 'source.png')

    fs.writeFileSync(srcPNG,
      Buffer.from(formData.sourceDataURL, 'base64'),
      err => { if (err) throw err }
    )
    command.input(srcPNG).native()
  }

  if (arc !== 'bypass' || source) {
    render(formData, command, file)
  } else {
    command.run()
  }
}

const getTempFile = (evt, { formData }) => {
  evt.reply('render-started')
  fs.promises.readdir(tempDir).then(files => {
    const tempFile = files.filter(file => (
      file.startsWith('temp.')
    ))[0]

    format(evt, formData, tempFile)
  }).catch(err => { throw err })
}

module.exports = getTempFile