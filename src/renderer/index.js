import React from 'react'
import { render } from 'react-dom'
import { ipcRenderer, remote } from 'electron'
import App from './App'

const enableFocusRings = function (e) {
  if (e.keyCode !== 9) return
  this.className = 'accessable'
  this.removeEventListener('keydown', enableFocusRings)
}

document.body.addEventListener('keydown', enableFocusRings)

ipcRenderer.send('clear')
ipcRenderer.send('load-prefs')

ipcRenderer.on('prefs-retrieved', (evt, data) => {
  render(
    <App preferences={data} />,
    document.querySelector('#root')
  )
})

if (process.env.NODE_ENV === 'development') {
  let pos = {}
  const menu = new remote.Menu()

  menu.append(new remote.MenuItem({
    label: 'Inspect Element',
    click() {
      remote.getCurrentWindow().inspectElement(pos.x, pos.y)
    }
  }))

  window.addEventListener('contextmenu', e => {
    e.preventDefault()
    pos = { x: e.x, y: e.y }
    menu.popup(remote.getCurrentWindow())
  })
}