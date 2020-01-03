const ffmpeg = require('fluent-ffmpeg')
const ffmpegStatic = require('ffmpeg-static-electron')
const ffprobeStatic = require('ffprobe-static-electron')
const { fixPathForAsarUnpack } = require('electron-util')

ffmpeg.setFfmpegPath(fixPathForAsarUnpack(ffmpegStatic.path))
ffmpeg.setFfprobePath(fixPathForAsarUnpack(ffprobeStatic.path))

module.exports = ffmpeg