import React, { useCallback, useContext, useEffect, useState } from 'react'

import { FormContext } from '../../store/formStore'
import { updateState, toggleCheckbox } from '../../actions/form'
import { BATCH_READY } from '../../status/types'

const { interop } = window.ABLE2

const Source = () => {
  const ctx = useContext(FormContext)
  const { sourceOnTop, sourceOnTopWarning, dispatch  } = ctx
  const [ sourceSuggestions, loadSourceSuggestions ] = useState([])

  useEffect(() => {
    fetch('https://jhwebdeveloper.github.io/Able2-public-resources/data.json')
      .then(res => res.json())
      .then(res => {
        loadSourceSuggestions(res.sort())
      })
      .catch(err => { throw err })
  }, [])

  const toggleSourceOnTop = useCallback(async e => {
    e.persist()

    let response = 0

    if (sourceOnTopWarning && !sourceOnTop) {
      response = await interop.dialog.sourceOnTopAlert()
    }
  
    if (response === 0) dispatch(toggleCheckbox(e))
  }, [sourceOnTop, sourceOnTopWarning])
  

  return (
    <fieldset
      name="source-overlay"
      disabled={ctx.arc === 'bypass' && (!ctx.vidData.is16_9 || ctx.status === BATCH_READY)}>
      <legend>Source:</legend>
      <input
        type="text"
        name="source"
        list="source-suggestions"
        value={ctx.source}
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
          checked={ctx.sourcePrefix}
          onChange={e => dispatch(toggleCheckbox(e))} />
        Add "Source: " to beginning
      </label>
      <label>
        <input
          type="checkbox"
          name="sourceOnTop"
          checked={sourceOnTop}
          onChange={e => toggleSourceOnTop(e)} />
        Place source at top of video
      </label>
    </fieldset>
  )
}

export default Source
