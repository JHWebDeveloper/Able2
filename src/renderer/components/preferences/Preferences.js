import React, { useContext } from 'react'
import '../../css/preferences.css'

import { PrefsProvider, PrefsContext } from '../../store/prefsStore'
import Directories from './Directories'
import Options from './Options'
import SavePreferences from './SavePreferences'

const PrefsForm = () => {
  const { preferences, dispatch } = useContext(PrefsContext)
  const { renderOutput, sourceOnTopWarning, directories } = preferences

  return (
    <form id="preferences" onSubmit={e => e.preventDefault()}>
      <Options
        renderOutput={renderOutput}
        sourceOnTopWarning={sourceOnTopWarning}
        dispatch={dispatch} />
      <Directories
        directories={directories}
        dispatch={dispatch} />
      <SavePreferences />
    </form>
  )
}

const Preferences = () => (
  <PrefsProvider>
    <PrefsForm />
  </PrefsProvider>
)

export default Preferences
