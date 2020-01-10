import path from 'path'

export const checkIsImage = name => /^\.(bmp|gif|jfif|jp(e?g|2)|png|tga|tiff?|webp)$/i.test(path.extname(name))

export const checkIsGIF = name => /^\.gif$/i.test(path.extname(name))
