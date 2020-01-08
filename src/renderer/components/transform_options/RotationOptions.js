import React, { useContext } from 'react'
import { FormContext } from '../../store/formStore'
import RadioSet from '../form_elements/RadioSet'

const RotationOptions = () => {
  const { rotate, dispatch } = useContext(FormContext)

  return (
    <fieldset name="rotate">
      <legend>Rotate:</legend>
      <RadioSet
        name="rotate"
        state={rotate}
        dispatch={dispatch}
        buttons={[
          {
            label: '0°',
            value: ''
          },
          {
            label: '90°cw',
            value: 'transpose=1,'
          },
          {
            label: '90°ccw',
            value: 'transpose=2,'
          },
          {
            label: '180°',
            value: 'transpose=2,transpose=2,'
          }
        ]} />
    </fieldset>
  )
}

export default RotationOptions
