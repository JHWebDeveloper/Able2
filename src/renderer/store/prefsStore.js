import React, { createContext, useReducer } from 'react'

import reducer from '../reducers/reducer'
import { augmentedDispatch } from '../utilities'

export const PrefsContext = createContext()

export const PrefsProvider = ({ children, preferences }) => {
  const [state, dispatch] = useReducer(reducer, {...preferences})

  return (
    <PrefsContext.Provider value={{
      ...state,
      dispatch: augmentedDispatch(dispatch, state)
    }}>
      { children }
    </PrefsContext.Provider>
  )
}