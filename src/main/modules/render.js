import path from 'path'
import { fixPathForAsarUnpack } from 'electron-util'

const render = (formData, command) => {
  const { arc, bg, rotate, source, renderOutput } = formData

  const [ width, height ] = renderOutput.split('x')

  const srcCmd  = () => source ? '[vid];[vid][1:v]overlay' : ''

  const getBGPath = file => fixPathForAsarUnpack(process.env.NODE_ENV === 'development' 
    ? path.resolve(__dirname, '..', 'backgrounds', height, file)
    : path.join(__dirname, 'assets', 'backgrounds', height, file)
  )
  
  if (arc === 'fit' && (bg === 'blue' || bg === 'grey')) {
    command
      .input(getBGPath(`${bg}.mov`))
      .complexFilter([
        `[${source ? 2 : 1}:v]loop=loop=-1:size=419.58042:start=0[bg];`,
        `[0:v]${rotate}scale=w=${width}:h=${height}:force_original_aspect_ratio=decrease[fg];`,
        '[bg][fg]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2:shortest=1',
        srcCmd()
      ].join('')).run()
  } else if (arc === 'fit' && (bg === 'alpha' || bg === 'black')) {
    command
      .input(getBGPath(`${bg}.png`))
      .complexFilter([
        `[0:v]${rotate}scale=w=${width}:h=${height}:force_original_aspect_ratio=decrease[fg];`,
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
        `[0:v]${rotate}scale=w=${boxW}:h=${boxH}:force_original_aspect_ratio=increase,`,
        `crop=${boxW}:${boxH}:(iw-ow)/2:(ih-oh)/2[scaled];`,
        `[bg][scaled]overlay=(main_w-overlay_w)/2:${boxY}:shortest=1[mixdown];`,
        `[mixdown][${fgLevel}:v]overlay`,
        srcCmd()
      ].join('')).run()
  } else if (arc === 'fill') {
    command
      .complexFilter([
        `${rotate}scale=w=${width}:h=${height}:force_original_aspect_ratio=increase,`,
        `crop=${width}:${height}:(iw-ow)/2:(ih-oh)/2`,
        srcCmd()
      ].join('')).run()
  } else if (arc === 'bypass' && source) {
    command
      .complexFilter(`[0:v]${rotate}scale=w=${width}:h=${height}[vid];[vid][1:v]overlay`)
      .run()
  } else if (rotate !== '') {
    command
      .complexFilter(rotate.replace(/,$/, ''))
      .run()
  } else {
    command.run()
  }
}

export default render
