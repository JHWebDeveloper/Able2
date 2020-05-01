import React, { useContext } from 'react'
import { arrayOf, object, string } from 'prop-types'
import uuidv1 from 'uuid/v1'

import { FormContext } from '../../store/formStore'
import { closeErrorBox } from '../../actions/form'

const Error = ({ heading, message }) => {
  const { errMsg, dispatch } = useContext(FormContext)

  return (
    <div className="error">
      <button onClick={() => dispatch(closeErrorBox())}>close</button>
      <h2>{heading}</h2>
      {message.map(p => <p key={uuidv1()}>{p}</p>)}
      {errMsg.err && <>
        <p>Please copy and email the below information to jonathan.hamilton@wftv.com:</p>
        <code>{errMsg.err.toString()}</code>
      </>}
    </div>
  )
}

Error.propTypes = {
  heading: string.isRequired,
  message: arrayOf(string).isRequired
}

export const FetchError = () => <Error
  heading="Video Not Found!"
  message={[
    'The URL you submitted may be invalid or no longer available.',
    'If not, check your internet connection.'
  ]} />

export const FileError = () => <Error
  heading="Unsupported File Type!"
  message={[
    'The file you attempted to upload is not compatible with Able2.'
  ]}/>

export const UploadError = () => <Error
  heading="Error Uploading File!"
  message={[
    'The file may contain errors or an unrecognized codec.'
  ]} />

export const DownloadError = () => <Error
  heading="Unable to Download!"
  message={[
    'Check your internet connection and try again.'
  ]} />

export const RenderError = () => <Error
  heading="Render Failed!"
  message={[
    'Your video was downloaded, but your format settings failed to render.'
  ]} />

export const RecordingError = () => <Error
  heading="Screen Record Failed!"
  message={[
    'Something went wrong. Please check the audio/video configuration of your computer and try again.'
  ]} />
