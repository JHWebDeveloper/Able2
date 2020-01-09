export default (src, output, onTop) => {
  const cnv = document.createElement('canvas')
  const ctx = cnv.getContext('2d')
  const [width, height] = output.split('x')

  const [
    fontSize,
    txtX,
    txtY,
    minW,
    pad,
    boxY,
    boxH
  ] = height === '720' ? [
    25,
    640, 
    onTop ? 53 : 684,
    330,
    40,
    onTop ? 28 : 659,
    33
  ] : [
    37.5,
    960,
    onTop ? 103.5 : 1026,
    495,
    60,
    onTop ? 66 : 988.5,
    49.5
  ]

  cnv.width = width
  cnv.height = height

  ctx.globalCompositeOperation = 'destination-over'

  ctx.fillStyle = '#ffffff'
  ctx.font      = `${fontSize}px Gotham`
  ctx.textAlign = 'center'
  ctx.fillText(src, txtX, txtY)

  const txtW = Math.max(minW, ctx.measureText(src).width + pad)

  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.fillRect(txtX - txtW / 2, boxY, txtW, boxH)

  return cnv.toDataURL().replace(/^data:image\/\w+;base64,/, '')
}
