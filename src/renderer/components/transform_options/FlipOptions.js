import React, { useContext } from 'react'
import { FormContext } from '../../store/formStore'
import { toggleCheckbox } from '../../actions/form'

const FlipOptions = () => {
  const { hflip, vflip, dispatch } = useContext(FormContext)

  return (
    <fieldset name="flip">
      <legend>Flip:</legend>
      <label>
        <input
          type="checkbox"
          name="hflip"
          checked={hflip}
          onChange={e => dispatch(toggleCheckbox(e))} />
        Horizontally
      </label>
      <label>
        <input
          type="checkbox"
          name="vflip"
          checked={vflip}
          onChange={e => dispatch(toggleCheckbox(e))} />
        Vertically
      </label>
    </fieldset>
  )
}

export default FlipOptions
