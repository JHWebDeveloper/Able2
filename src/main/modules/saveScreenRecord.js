import { promises as fsp } from 'fs'
import path from 'path'
import ffmpeg from './ffmpeg'
import { tempDir } from './handleExtFiles'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const timestamp = () => {
  const d = new Date()
  const hours = d.getHours()
  const minutes = d.getMinutes()

  const time = [
    hours === 0 ? 12 : hours > 12  ? hours - 12 : hours,
    minutes === 0 ? '' : minutes > 9 ? minutes : `0${minutes}`,
    hours > 11 ? 'pm' : 'am'
  ].join('')

  const date = `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`

  return `${days[d.getDay()]} ${time} ${date}`
}

const fixScreenRecord = (original, filePath) => new Promise((resolve, reject) => {
  ffmpeg(original)
    .outputOptions([
      '-filter:v fps=fps=60',
      '-preset:v ultrafast'
    ])
    .output(filePath)
    .on('end', resolve)
    .on('error', reject)
    .run()
})

const saveScreenRecord = async buffer => {
  const fileName = `Able2 Screen Record ${timestamp()}.mp4`
  const filePath = path.join(tempDir, `temp.${fileName}`)
  const original = path.join(tempDir, 'screen_record.mp4')

  await fsp.writeFile(original, buffer)
  await fixScreenRecord(original, filePath)

  return [{
    name: fileName,
    path: filePath
  }]
}

export default saveScreenRecord
