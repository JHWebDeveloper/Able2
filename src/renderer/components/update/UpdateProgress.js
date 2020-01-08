import React from 'react'
import { number, string } from 'prop-types'

const UpdateProgress = ({ version, percent }) => (
  <div className="updater">
    <p>Update found!</p>
    <progress value={percent} max="100"></progress>
    <p>Downloading Able2 v{version}</p>
  </div>
)

UpdateProgress.propTypes = {
  version: string.isRequired,
  percent: number.isRequired
}

export default UpdateProgress
