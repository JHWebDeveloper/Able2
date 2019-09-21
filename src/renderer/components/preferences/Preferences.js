import React from 'react'
import Helmet from 'react-helmet';
import '../../css/preferences.css'

import { PrefsProvider } from '../../store/prefsStore'
import Directories from './Directories'
import OutputResolution from './OutputResolution'
import SavePreferences from './SavePreferences'
import PrefsPropType from './PrefsPropType';

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

Preferences.propTypes = PrefsPropType

export default Preferences