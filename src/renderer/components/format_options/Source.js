import React, { useContext } from 'react'
import { FormContext } from '../../store/formStore'
import { updateState, toggleCheckbox } from '../../actions/form'

const Source = () => {
  const { source, sourcePrefix, dispatch  } = useContext(FormContext)
  return (
    <fieldset name="source-overlay">
      <legend>Source:</legend>
      <input
        type="text"
        name="source"
        value={source}
        onChange={e => dispatch(updateState(e))}
        maxLength="51"
        placeholder="if none, leave blank"  />
      <label>
        <input
          type="checkbox"
          name="sourcePrefix"
          checked={sourcePrefix}
          onChange={e => dispatch(toggleCheckbox(e))} />
        Add "Source: " to begining
      </label>
    </fieldset>
  )
}

export default Source
