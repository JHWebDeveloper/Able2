import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { FormContext } from '../../store/formStore'
import { updateState, toggleCheckbox } from '../../actions/form'

const Source = () => {
  const { source, sourcePrefix, dispatch  } = useContext(FormContext)
  const [sourceSuggestions, loadSourceSuggestions] = useState([])

  useEffect(() => {
    axios
      .get('https://jhwebdeveloper.github.io/Able2-source-name-suggestions/data.json')
      .then(res => {
        loadSourceSuggestions(res.data.sort())
      })
      .catch(err => { throw err })
  }, [])

  return (
    <fieldset name="source-overlay">
      <legend>Source:</legend>
      <input
        type="text"
        name="source"
        list="source-suggestions"
        value={source}
        onChange={e => dispatch(updateState(e))}
        maxLength="51"
        placeholder="if none, leave blank" />
      <datalist id="source-suggestions">
        {sourceSuggestions.map(src => (
          <option key={src}>{src}</option>
        ))}
      </datalist>
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
