import React from 'react'
import { render } from 'react-dom'
import { ipcRenderer } from 'electron'
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
    document.getElementById('root')
  )
})