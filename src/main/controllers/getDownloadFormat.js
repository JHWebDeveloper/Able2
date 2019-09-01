const getDownloadFormat = (out, opt = 'quality') => ([
  '-f',
  [
    opt === 'quality' ? `bestvideo[height<=${out}][fps<=60]+bestaudio/` : '',
    `best[height<=${out}][fps<=60]/best`
  ].join('')
])

module.exports = getDownloadFormat