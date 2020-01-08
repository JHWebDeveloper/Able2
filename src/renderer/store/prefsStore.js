import React, { createContext, useEffect, useReducer } from 'react'

import prefsReducer from '../reducers/prefsReducer'
import { loadPrefs, syncPreferences } from '../actions/preferences'
import { augmentedDispatch } from '../utilities'
import PrefsPropType from '../components/preferences/PrefsPropType'

const { interop } = window.ABLE2

const initState = {
  directories: [],
  sourceOnTopWarning: true,
  renderOutput: '1280x720'
}

export const PrefsContext = createContext()

export const PrefsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(prefsReducer, initState)

  useEffect(() => {
    (async () => {
      dispatch(await loadPrefs())
    })()

    interop.addPrefsSyncListener(newPrefs => {
      dispatch(syncPreferences(newPrefs))
    })

    return () => {
      interop.removePrefsSyncListener()
    }
  }, [])

  return (
    <PrefsContext.Provider value={{
      preferences: state,
      dispatch: augmentedDispatch(dispatch, state)
    }}>
      { children }
    </PrefsContext.Provider>
  )
}

PrefsProvider.propTypes = PrefsPropType
