import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import './css/index.css'

if (process.platform !== 'darwin') require('./css/windows.css')

import Main from './components/main/Main'
import Preferences from './components/preferences/Preferences'
import Help from './components/help/Help'

const  App = ({ preferences }) => (
  <HashRouter>
    <Route exact path="/" component={() => (
      <Main preferences={preferences} />
    )} />
    <Route path="/preferences" component={() => (
      <Preferences preferences={preferences}/>
    )} />
    <Route path="/help" component={Help} />
  </HashRouter>
)

export default App