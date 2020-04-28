export const initTabbedBrowsing = () => {
  document.body.onkeydown = function (e) {
    if (e.keyCode !== 9) return
    
    this.className = 'accessible'
    this.onkeydown = false
  }
}

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

export const isURL = url => urlRegex.test(url)

export const secondsToTC = secs => [
  Math.floor(secs / 3600),
  Math.floor(secs / 60) % 60,
  secs % 60
].map(n => n < 10 ? `0${n}` : n).join(':')

const mult = [1, 60, 3600]

export const tcToSeconds = hms => {
  const secs = hms
    .split(':')
    .reverse()
    .map(val => parseInt(val) || 0)
    .reduce((acc, val, i) => acc + val * mult[i], 0)
  
  return Math.min(secs, 86399)
}

export const simplifyTimecode = tc => secondsToTC(tcToSeconds(tc))

const filterBadChars = (str, p1, p2, p3, p4) => {
  if (p1) return 'and'
  if (p2) return 'prc'
  if (p3) return '2A'
  if (p4) return encodeURIComponent(p4).replace(/%/g, '')
}

export const cleanFileName = fileName => fileName
  .replace(/(&)|(%)|(\*)|(["/:;<>?\\`|ŒœŠšŸ​]|[^!-ż\s])/g, filterBadChars)
  .slice(0, 286)
  .replace(/^\s*|\s*$/g, '')

export const cleanSourceName = srcName => (
  srcName.replace(/(^\s*(source:|courtesy:)\s*)|(\s*$)/ig, '')
)

export const augmentedDispatch = (dispatch, state) => input => (
  input instanceof Function ? input(dispatch, state) : dispatch(input)
)
