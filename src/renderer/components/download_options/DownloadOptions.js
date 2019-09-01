import React, { useContext } from 'react'

import { FormContext } from '../../store/formStore'
import { updateState } from '../../actions/form'

import Timecode from '../elements/Timecode'
import AspectRatioOptions from '../format_options/AspectRatioOptions'
import BackgroundOptions from '../format_options/BackgroundOptions'
import Source from '../format_options/Source'
import Optimizer from './Optimizer'
import Directories from './Directories'
import Reset from '../elements/Reset'

const DownloadOptions = () => {
  const { status, fileName, directories, dispatch } = useContext(FormContext);
  const buttonTitle = status === 'URL_READY' ? 'Download' : 'Save'

  return (
    <fieldset>
      <fieldset>        
        <legend>Filename:</legend>
        <input
          type="text"
          name="fileName"
          id="fileName"
          value={fileName}
          onChange={e => dispatch(updateState(e))} />
      </fieldset>
      {status !== 'IMG_READY' && <fieldset name="timecodes">
        <Timecode name="start" />
        <Timecode name="end" />
      </fieldset>}
      {status === 'URL_READY' && <Optimizer />}
      <details open={status !== 'URL_READY'}>
        <summary>Advanced Options</summary>
        <AspectRatioOptions />
        <BackgroundOptions />
        <Source />
      </details>
      <Directories />
      <button 
        type="submit"
        title={buttonTitle}
        disabled={!fileName}>
        {buttonTitle}
      </button>
      <Reset />
    </fieldset>
  )
}

export default DownloadOptions
