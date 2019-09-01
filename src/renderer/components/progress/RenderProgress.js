import React from 'react'

const RenderProgress = ({ prc, timemark, frames }) => (
  <div className="progress">
    <p>Rendering...</p>
    <progress value={prc} max="100"></progress>
    <span>Timemark: <span className="monospace">{timemark}</span></span>
    <span>Frames Rendered: <span className="monospace">{frames}</span></span>
  </div>
)

export default RenderProgress
