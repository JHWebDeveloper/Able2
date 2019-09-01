import React, { useCallback, useContext, useEffect } from 'react'
import { ipcRenderer, remote } from 'electron'
import { FormContext } from '../../store/formStore'

const Reset = () => {
  const { status } = useContext(FormContext)

  useEffect(() => {
    ipcRenderer.on('cleared', () => {
      ipcRenderer.send('load-prefs')
    })
    return () => (
      ipcRenderer.removeAllListeners(['cleared'])
    )
  }, [])

  const resetForm = useCallback(() => {
    if (status === 'DONE') {
      location.reload()
    } else {
      remote.dialog.showMessageBox({
        buttons: ['OK', 'Cancel'],
        message: 'Clear form and start over?'
      }, (res) => {
        if (!res) location.reload()
      })
    }
  }, [])

  return (
    <button
      type="button"
      title="Start Over"
      onClick={resetForm}>
      Start Over
    </button>
  )
}

export default Reset
