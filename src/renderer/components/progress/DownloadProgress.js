import React from 'react'
import { oneOfType, bool, string } from 'prop-types'
import { remote } from 'electron'

import { convertMiB } from '../../utilities'

const win = remote.getCurrentWindow()

const ProgressBar = ({ file, prc, size, speed, eta }) => {
  const message = `Downloading${file ? ` ${file}` : '...'}`
  const percent = parseInt(prc)

  win.setProgressBar(percent / 100)

  return (
    <div className="progress">
      <p>{message}</p>
      <progress value={percent} max="100" />
      <span>{`${prc} of ${convertMiB(size)} at ${convertMiB(speed)}/s`}</span>
      <span>ETA: <span className="monospace">{eta}</span></span>
    </div>
  )
}

ProgressBar.propTypes = {
  file: oneOfType([bool, string]),
  prc: string,
  size: string,
  speed: string,
  eta: string
}

export default ProgressBar
