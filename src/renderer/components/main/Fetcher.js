import React, { useContext } from 'react'
import { FormContext } from '../../store/formStore'
import { updateState, getURLInfo } from '../../actions/form'
import { isURL, contextMenu } from '../../utilities'

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
        onContextMenu={contextMenu}
        maxLength="95"
        placeholder="Paste URL here..." />
      <button
        type="button"
        onClick={() => dispatch(getURLInfo(ctx))}
        disabled={!isURL(url)}>
        Fetch Video
      </button>
    </fieldset>
  )
}

export default Fetcher
