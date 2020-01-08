import React from 'react'
import '../../css/index.css'
import '../../css/preferences.css'

import { PrefsProvider } from '../../store/prefsStore'
import Directories from './Directories'
import Options from './Options'
import SavePreferences from './SavePreferences'

const Preferences = () => (
  <div className="preferences">
    <PrefsProvider>
      <Options />
      <Directories />
      <SavePreferences/>
    </PrefsProvider>
  </div>
)

export default Preferences