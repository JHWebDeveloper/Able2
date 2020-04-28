import React, { useCallback, useContext } from 'react'

import { FormContext } from '../../store/formStore'
import { loading, updateState, getURLInfo } from '../../actions/form'
import { isURL } from '../../utilities'

const Fetcher = () => {
  const { url, end, renderOutput, dispatch } = useContext(FormContext)

  const getInfoAndAnimate = useCallback(() => {
    dispatch(loading())
    dispatch(getURLInfo({ url, end, renderOutput }))
  }, [url, end, renderOutput])

  return (
    <fieldset name="fetcher">
      <input
        type="text"
        name="url"
        value={url}
        onChange={e => dispatch(updateState(e))}
        placeholder="Paste URL here..." />
      <button
        type="button"
        name="fetch"
        title="Fetch Video"
        onClick={getInfoAndAnimate}
        disabled={!isURL(url)}>
        Fetch Video
      </button>
    </fieldset>
  )
}

export default Fetcher
