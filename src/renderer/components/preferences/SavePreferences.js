import React, { useCallback, useContext, useState } from 'react'

import { PrefsContext } from '../../store/prefsStore'
import { savePreferences } from '../../actions/preferences'

import Spinner from '../svg/Spinner'

const { interop } = window.ABLE2

const SavePreferences = () => {
  const { preferences, dispatch } = useContext(PrefsContext)
  const [ saving, toggleSaving ] = useState(false)

  const save = useCallback(async () => {
    toggleSaving(true)
    dispatch(savePreferences(preferences, toggleSaving))
  }, [preferences])

  return (
    <div id="save">
      <button
        name="save-prefs"
        onClick={save}
        disabled={saving}
        title="Save preferences">
        {saving ? <Spinner fill="#eee" /> : 'Save'}
      </button>
      <button
        name="close-prefs"
        onClick={interop.closeCurrentWindow}
        title="Close preferences">
        Close
      </button>
    </div>
  )
}

export default SavePreferences
