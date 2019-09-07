import React from 'react'
import { remote } from 'electron'

const win = remote.getCurrentWindow()

const RenderProgress = ({ prc, timemark, frames }) => {
  win.setProgressBar(prc / 100)

  return (
    <div className="progress">
      <p>Rendering...</p>
      <progress value={prc} max="100"></progress>
      <span>Timemark: <span className="monospace">{timemark}</span></span>
      <span>Frames Rendered: <span className="monospace">{frames}</span></span>
    </div>
  )
}

export default RenderProgress
