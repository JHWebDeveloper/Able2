import React from 'react'
import Helmet from 'react-helmet';
import '../../css/preferences.css'

import { PrefsProvider } from '../../store/prefsStore'
import Directories from './Directories'
import OutputResolution from './OutputResolution'
import SavePreferences from './SavePreferences'

const Preferences = ({ preferences }) => (
  <div className="preferences">
    <Helmet>
      <title>Preferences</title>
    </Helmet>
    <PrefsProvider preferences={preferences}>
      <OutputResolution />
      <Directories />
      <SavePreferences/>
    </PrefsProvider>
  </div>
)

export default Preferences