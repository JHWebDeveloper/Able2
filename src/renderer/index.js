import React from 'react'
import { render } from 'react-dom'
import App from './components/main/App'

const enableFocusRings = function (e) {
  if (e.keyCode !== 9) return
  this.className = 'accessable'
  this.removeEventListener('keydown', enableFocusRings)
}

document.body.addEventListener('keydown', enableFocusRings)

render(<App />, document.querySelector('#root'))

window.ABLE2.interop.setContextMenu()
