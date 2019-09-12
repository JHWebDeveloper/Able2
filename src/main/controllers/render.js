const path = require('path')
const { copyToDirectories } = require('./handleExtFiles')
const { fixPathForAsarUnpack } = require('electron-util')

const filterBadChars = (str, p1, p2, p3, p4) => {
  if (p1) return 'and'
  if (p2) return 'prc'
  if (p3) return ''
  if (p4) return '_'
}

const cleanFileName = fileName => (
  fileName.replace(/(&)|(%)|((?<=^Source):)|([/\\?*:|"<>])/g, filterBadChars)
)

const render = (formData, command) => {
  const { arc, bg, source, directories, vidData, renderOutput } = formData

  const [ width, height ] = renderOutput.split('x')

  const srcCmd  = () => source ? '[vid];[vid][1:v]overlay' : ''
  const getBGPath = file => (
    fixPathForAsarUnpack(path.join(__dirname, 'build', 'assets', 'backgrounds', height, file))
  )
  
  if (arc === 'fit' && (bg === 'blue' || bg === 'grey')) {
    command
      .input(getBGPath(`${bg}.mov`))
      .complexFilter([
        `[${source ? 2 : 1}:v]loop=loop=-1:size=419.58042:start=0[bg];`,
        `[0:v]scale=w=${width}:h=${height}:force_original_aspect_ratio=decrease[fg];`,
        '[bg][fg]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2:shortest=1',
        srcCmd()
      ].join('')).run()
  } else if (arc === 'fit' && (bg === 'alpha' || bg === 'black')) {
    command
      .input(getBGPath(`${bg}.png`))
      .complexFilter([
        `[0:v]scale=w=${width}:h=${height}:force_original_aspect_ratio=decrease[fg];`,
        `[${source ? 2 : 1}:v][fg]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2`,
        srcCmd()
      ].join('')).run()
  } else if (arc === 'fit' && (bg === 'tv' || bg === 'laptop')) {
    const [bgLevel, fgLevel] = source ? [2, 3] : [1, 2]
    const [boxW, boxH, boxY] = height === '1080'
      ? bg === 'tv' ? [1576, 886, 78] : [1366, 778, 86]
      : bg === 'tv' ? [1050, 590, 52] : [912, 518, 58]

    command
      .input(getBGPath('blue.mov'))
      .input(getBGPath(`${bg}.png`))
      .complexFilter([
        `[${bgLevel}:v]loop=loop=-1:size=419.58042:start=0[bg];`,
        `[0:v]scale=w=${boxW}:h=${boxH}:force_original_aspect_ratio=increase,`,
        `crop=${boxW}:${boxH}:(iw-ow)/2:(ih-oh)/2[scaled];`,
        `[bg][scaled]overlay=(main_w-overlay_w)/2:${boxY}:shortest=1[mixdown];`,
        `[mixdown][${fgLevel}:v]overlay`,
        srcCmd()
      ].join('')).run()
  } else if (arc === 'fill') {
    command
      .complexFilter([
        `scale=w=${width}:h=${height}:force_original_aspect_ratio=increase,`,
        `crop=${width}:${height}:(iw-ow)/2:(ih-oh)/2`,
        srcCmd()
      ].join('')).run()
  } else if (arc === 'bypass' && source) {
    if (vidData.is16_9) {
      command
        .complexFilter(`[0:v]scale=w=${width}:h=${height}[vid];[vid][1:v]overlay`)
        .run()
    } else if (status !== 'BATCH_READY') {
      copyToDirectories(directories, 'source.png', `${cleanFileName(source)}.png`)
      command.run()
    } else {
      command.run()
    }
  }
}

module.exports = render