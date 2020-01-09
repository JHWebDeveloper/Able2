import React, { useContext } from 'react'

import { PrefsContext } from '../../store/prefsStore'
import { toggleCheckbox } from '../../actions/form'
import RadioSet from '../form_elements/RadioSet'

const _720  = [1280, 720].join('x')
const _1080 = [1920, 1080].join('x')

const OutputResolution = () => {
  const { preferences, dispatch } = useContext(PrefsContext)
  const { renderOutput, sourceOnTopWarning } = preferences

  return (
    <>
      <fieldset>
        <legend>Render Output Resolution</legend>
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
            }
          ]}/>
      </fieldset>
      <fieldset>
        <input
          type="checkbox"
          name="sourceOnTopWarning"
          checked={sourceOnTopWarning}
          onChange={e => dispatch(toggleCheckbox(e))} />
        Source at top warning
      </fieldset>
    </>
  )
}

export default OutputResolution
