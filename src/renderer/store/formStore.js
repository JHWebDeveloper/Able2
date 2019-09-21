import React, { createContext, useReducer } from 'react'

import reducer from '../reducers/reducer'
import { augmentedDispatch } from '../utilities'
import Form from '../components/main/Form'
import PrefsPropType from '../components/preferences/PrefsPropType'

export const initState = {
  status: false,
  url: '',
  recording: false,
  vidData: {
    title: '',
    thumbnail: false,
    duration: 0,
    width: 0,
    height: 0,
    fps: 0,
    isImage: false
  },
  fileName: '',
  start: {
    enabled: false,
    display: '00:00:00',
    tc: 0
  },
  end: {
    enabled: false,
    display: '00:00:00',
    tc: 0
  },
  timer: {
    enabled: false,
    display: '00:01:00',
    tc: 60
  },
  arc: 'bypass',
  bg: 'blue',
  rotate: '',
  hflip: false,
  vflip: false,
  source: '',
  sourcePrefix: true,
  optimize: 'quality',
  downloadProgress: {
    file: null,
    prc: '0%',
    size: '0MB',
    speed: '0MB/s',
    eta: '00:00'
  },
  renderProgress: {
    prc: 0,
    timemark: '00:00:00',
    frames: 0
  },
  renderOutput: '1280x720',
  directories: []
}

export const FormContext = createContext()

export const FormProvider = ({ children, preferences }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initState,
    ...preferences
  })

  return (
    <FormContext.Provider value={{
      ...state,
      dispatch: augmentedDispatch(dispatch, state)
    }}>
      { children }
    </FormContext.Provider>
  )
}

FormProvider.propTypes = PrefsPropType