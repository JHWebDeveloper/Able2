import React, { useContext } from 'react'
import { FormContext } from '../../store/formStore'

import RadioSet from '../form_elements/RadioSet'

const AspectRatioOptions = () => {
  const { arc, dispatch } = useContext(FormContext)

  return (
    <fieldset name="aspect-ratio">
      <legend>AR Correction:</legend>
      <RadioSet
        name="arc"
        state={arc}
        dispatch={dispatch}
        buttons={[
          {
            label: 'None',
            value: 'bypass'
          },
          {
            label: 'Fill Frame',
            value: 'fill'
          },
          {
            label: 'Fit Inside Frame',
            value: 'fit'
          }
        ]} />
    </fieldset>
  )
}

export default AspectRatioOptions
