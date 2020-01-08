import React, { useContext } from 'react'

import { FormContext } from '../../store/formStore'
import { updateState } from '../../actions/form'
import { URL_READY, VID_READY } from '../../status/types'

import Timecode from '../form_elements/Timecode'
import AspectRatioOptions from '../format_options/AspectRatioOptions'
import BackgroundOptions from '../format_options/BackgroundOptions'
import Source from '../format_options/Source'
import Optimizer from './Optimizer'
import Directories from './Directories'
import Reset from '../form_elements/Reset'
import RotationOptions from '../transform_options/RotationOptions'
import FlipOptions from '../transform_options/FlipOptions'

const DownloadOptions = () => {
  const { status, fileName, dispatch } = useContext(FormContext);
  const buttonTitle = status === URL_READY ? 'Download' : 'Save'

  return (
    <fieldset>
      <fieldset>        
        <legend>Filename:</legend>
        <input
          type="text"
          name="fileName"
          id="fileName"
          value={fileName}
          onChange={e => dispatch(updateState(e))}
          placeholder="Required"
          required />
      </fieldset>
      {(status === URL_READY || status === VID_READY) &&
        <fieldset name="timecodes">
          <Timecode name="start" />
          <Timecode name="end" />
        </fieldset>
      }
      {status === URL_READY && <Optimizer />}
      <details open={status !== URL_READY}>
        <summary>Formatting Options</summary>
        <AspectRatioOptions />
        <BackgroundOptions />
        <Source />
      </details>
      <details>
        <summary>Transform Options</summary>
        <RotationOptions />
        <FlipOptions />
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
