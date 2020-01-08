import React, { useContext } from 'react'

import { FormContext } from '../../store/formStore'
import { updateState, getURLInfo } from '../../actions/form'
import { isURL } from '../../utilities'

const Fetcher = () => {
  const ctx = useContext(FormContext)
  const { dispatch, url } = ctx

  return (
    <fieldset name="fetcher">
      <input
        type="text"
        name="url"
        value={url}
        onChange={e => dispatch(updateState(e))}
        maxLength="95"
        placeholder="Paste URL here..." />
      <button
        type="button"
        name="fetch"
        title="Fetch Video"
        onClick={() => dispatch(getURLInfo(ctx))}
        disabled={!isURL(url)}>
        Fetch Video
      </button>
    </fieldset>
  )
}

export default Fetcher
