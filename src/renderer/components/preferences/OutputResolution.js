import React, { useContext } from 'react'

import { PrefsContext } from '../../store/prefsStore'
import RadioSet from '../elements/RadioSet'

const _720  = [1280, 720].join('x')
const _1080 = [1920, 1080].join('x')

const OutputResolution = () => {
  const { renderOutput, dispatch } = useContext(PrefsContext)

  return (
    <>
      <h1>Render Output Resolution</h1>
      <RadioSet 
        name="renderOutput"
        state={renderOutput}
        dispatch={dispatch}
        buttons={[
          {
            label: _720,
            value: _720
          },
          {
            label: _1080,
            value: _1080
          },
        ]}/>
    </>
  )
}

export default OutputResolution
