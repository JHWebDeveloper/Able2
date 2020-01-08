import React, { useContext } from 'react'
import { FormContext } from '../../store/formStore'

import RadioSet from '../form_elements/RadioSet'

const Optimizer = () => {
  const { optimize, dispatch } = useContext(FormContext)

  return (
    <fieldset>
      <RadioSet
        name="optimize"
        state={optimize}
        dispatch={dispatch}
        buttons={[
          {
            label: 'Optimize Video Quality',
            value: 'quality'
          },
          {
            label: 'Optimize Download Time',
            value: 'download'
          }
        ]} />
    </fieldset>
  )
}

export default Optimizer
