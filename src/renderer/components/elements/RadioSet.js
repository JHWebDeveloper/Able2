import React from 'react'
import { string, func, arrayOf, shape, bool } from 'prop-types'
import uuidv1 from 'uuid/v1'

import { changeRadioValue } from '../../actions/form'

const RadioSet = ({ name, state, dispatch, buttons }) => (
  buttons.map(({ label, value, omit }) => (omit ? false :
    <label key={uuidv1()}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={state === value}
        onChange={e => dispatch(changeRadioValue(e))} />
      {label}
    </label>
  ))
)

RadioSet.propTypes = {
  name: string.isRequired,
  state: string.isRequired,
  dispatch: func.isRequired,
  buttons: arrayOf(shape({
    label: string.isRequired,
    value: string,
    omit: bool
  })).isRequired
}

export default RadioSet
