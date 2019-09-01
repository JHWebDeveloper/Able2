import React, { useCallback, useContext, useState } from 'react'
import { ipcRenderer } from 'electron'

import { PrefsContext } from '../../store/prefsStore'
import { savePreferences, closePreferences } from '../../actions/preferences'

import Spinner from '../elements/Spinner'

const SavePreferences = () => {
  const ctx = useContext(PrefsContext)
  const [saving, toggleSaving] = useState(false)

  const save = useCallback(() => {
    ipcRenderer.once('prefs-saved', () => {
      toggleSaving(false)
    })
    toggleSaving(true)
    ctx.dispatch(savePreferences(ctx))
  }, [ctx])

  return (
    <div>
      <button
        name="save-prefs"
        onClick={save}
        disabled={saving}
        title="Save preferences">
        {saving ? <Spinner fill="#eee" /> : 'Save'}
      </button>
      <button
        name="close-prefs"
        onClick={closePreferences}
        title="Close preferences">
        Close
      </button>
    </div>
  )
}

export default SavePreferences
