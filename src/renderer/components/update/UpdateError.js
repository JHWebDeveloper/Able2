import React from 'react'
import { func } from 'prop-types'

const UpdateError = ({ checkForUpdates }) => (
  <div className="updater">
    <p>Update could not be downloaded!</p>
    <button
      type="button"
      title="Try Again"
      onClick={checkForUpdates}>Try Again</button>
  </div>
)

UpdateError.propTypes = {
  checkForUpdates: func.isRequired
}

export default UpdateError
