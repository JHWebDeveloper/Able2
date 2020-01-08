import React from 'react'
import { oneOfType, bool, string } from 'prop-types'

import CancelButton from './CancelButton'
import { convertMiB } from '../../utilities'

const ProgressBar = ({ file, prc, size, speed, eta }) => (
  <div className="progress">
    <p>Downloading{file ? ` ${file}` : '...'}</p>
    <progress value={parseInt(prc)} max="100" />
    <span>{`${prc} of ${convertMiB(size)} at ${convertMiB(speed)}/s`}</span>
    <span>ETA: <span className="monospace">{eta}</span></span>
    <CancelButton />
  </div>
)

ProgressBar.propTypes = {
  file: oneOfType([bool, string]),
  prc: string,
  size: string,
  speed: string,
  eta: string
}

export default ProgressBar
