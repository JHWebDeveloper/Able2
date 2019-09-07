import React from 'react'
import { remote } from 'electron'
import Reset from '../elements/Reset'

const Completed = () => {
  remote.getCurrentWindow().setProgressBar(-1)

  return (
    <div className="completed">
      <p>Your video is ready!</p>
      <p>Thank you for using Able2.</p>
      <Reset />
    </div>
  )
}

export default Completed
