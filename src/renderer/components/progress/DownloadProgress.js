import React from 'react'

import { convertMiB } from '../../utilities'

const ProgressBar = ({ file, prc, size, speed, eta }) => {
  const message = `Downloading${file ? ` ${file}` : '...'}`

  return (
    <div className="progress">
      <p>{message}</p>
      <progress value={parseInt(prc)} max="100" />
      <span>{`${prc} of ${convertMiB(size)} at ${convertMiB(speed)}/s`}</span>
      <span>ETA: <span className="monospace">{eta}</span></span>
    </div>
  )
}

export default ProgressBar
