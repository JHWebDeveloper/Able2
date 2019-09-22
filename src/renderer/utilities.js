import { remote } from 'electron'

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

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

const filterBadChars = (str, p1, p2, p3) => {
  if (p1) return 'and'
  if (p2) return 'prc'
  if (p3) return '_'
}

export const cleanFileName = fileName => fileName
  .slice(0, 286)
  .replace(/(&)|(%)|([/\\?*:|"<>])/g, filterBadChars)

export const cleanSourceName = srcName => (
  srcName.replace(/(^\s*(source:|courtesy:)\s*)|(\s*$)/ig, '')
)

const round = (n, dec = 2) => Number(Math.round(n+'e'+dec)+'e-'+dec)

export const convertMiB = size => {
  const n = parseInt(size);
  return n >= 953.67431640625
    ? `${round(n * 0.001048576)}GB`
    : `${round(n * 1.048576)}MB`
}

export const augmentedDispatch = (dispatch, state) => input => (
  input instanceof Function ? input(dispatch, state) : dispatch(input)
)

const menu = new remote.Menu()

const menuItems = [
  new remote.MenuItem({ role: 'cut' }),
  new remote.MenuItem({ role: 'copy' }),
  new remote.MenuItem({ role: 'paste' }),
  new remote.MenuItem({ role: 'selectAll' })
]

menuItems.forEach(item => menu.append(item))

export const contextMenu = e => {
  e.preventDefault()
  if (!e.target.disabled) menu.popup(remote.getCurrentWindow())
}