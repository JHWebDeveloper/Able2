import React, { useContext } from 'react'
import { FormContext } from '../../store/formStore'
import { IMG_READY, BATCH_READY } from '../../status/types'

import RadioSet from '../form_elements/RadioSet'

const BackgroundOptions = () => {
  const { arc, bg, status, dispatch } = useContext(FormContext)

  return (
    <fieldset name="background" disabled={arc !== 'fit'}>
      <legend>Background:</legend>
      <RadioSet
        name="bg"
        state={bg}
        dispatch={dispatch}
        buttons={[
          {
            label: 'Animated Blue',
            value: 'blue'
          },
          {
            label: 'Animated Grey',
            value: 'grey'
          },
          {
            label: 'TV',
            value: 'tv',
            omit: status === IMG_READY || status === BATCH_READY
          },
          {
            label: 'Laptop',
            value: 'laptop',
            omit: status === IMG_READY || status === BATCH_READY
          },
          {
            label: 'Transparent',
            value: 'alpha'
          },
          {
            label: 'Black',
            value: 'black',
          },
        ]} />
    </fieldset>
  )
}

export default BackgroundOptions
