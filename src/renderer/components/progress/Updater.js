import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

const Updater = () => {
  const [version, getVersion] = useState(false)
  const [percent, getPercent] = useState(0)

  useEffect(() => {
    ipcRenderer.on('update-available', (evt, ver) => getVersion(ver))
    ipcRenderer.on('update-progress',  (evt, prc) => getPercent(prc))

    return () => {
      ipcRenderer.removeAllListeners(['update-available', 'update-progress'])
    }
  }, [])

  return !version ? false : (
    <div className="updater">
      <p>Update found!</p>
      <progress value={percent} max="100"></progress>
      <p>Downloading Able2 v{version}</p>
    </div>
  )
}

export default Updater