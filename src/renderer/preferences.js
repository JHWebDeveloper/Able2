import React from 'react'
import { render } from 'react-dom'
import Preferences from './components/preferences/Preferences'

render(<Preferences />, document.querySelector('#root'))

window.ABLE2.interop.setContextMenu()