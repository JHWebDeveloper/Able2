const path = require('path')
const ffmpeg = require('./ffmpeg')
const getFileFormat = require('./getFileFormat')
const { tempDir } = require('./handleExtFiles')

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const timestamp = () => {
  const d = new Date()
  const hours = d.getHours()
  const minutes = d.getMinutes()

  const time = [
    hours   === 0 ? 12 : hours > 12  ? hours - 12 : hours,
    minutes === 0 ? '' : minutes > 9 ? minutes : `0${minutes}`,
    hours > 11 ? 'pm' : 'am'
  ].join('')

  const date = [
    d.getMonth() + 1,
    d.getDate(),
    d.getFullYear()
  ].join('-')

  return [days[d.getDay()], time, date].join(' ')
}

const fileName = `Able2 Screen Record - ${timestamp()}.mp4`
const original = path.join(tempDir, `screen_record.mp4`)
const fixed = path.join(tempDir, `temp.${fileName}`)

const fixScreenRecord = evt => {
  ffmpeg(original)
    .outputOptions([
      '-filter:v fps=fps=60',
      '-preset:v ultrafast'
    ])
    .output(fixed)
    .on('end', () => {
      getFileFormat(evt, { name: fileName, path: fixed }, fixed)
    })
    .run()
}

module.exports = fixScreenRecord