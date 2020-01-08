import React from 'react'
import { oneOfType, string, number } from 'prop-types'

import CancelButton from './CancelButton'

const RenderProgress = ({ prc, timemark, frames, fileCount, fileTotal }) => (
  <div className="progress">
    <p>Rendering{fileCount && fileTotal ? ` ${fileCount} of ${fileTotal}` : '...'}</p>
    <progress value={prc} max="100"></progress>
    <span>Timemark: <span className="monospace">{timemark}</span></span>
    <span>Frames Rendered: <span className="monospace">{frames}</span></span>
    <CancelButton />
  </div>
)

RenderProgress.propTypes = {
  prc: number,
  timemark: string,
  frames: oneOfType([number, string]),
  fileCount: oneOfType([number, string]),
  fileTotal: oneOfType([number, string])
}

export default RenderProgress
