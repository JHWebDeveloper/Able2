const path = require('path')

const checkIsImage = name => /^\.(bmp|gif|jfif|jp(e?g|2)|png|tga|tiff?|webp)$/i.test(path.extname(name))

const checkIsGIF = name => /^\.gif$/i.test(path.extname(name))

module.exports = {
  checkIsImage,
  checkIsGIF
}