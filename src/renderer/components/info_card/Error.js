import React from 'react'
import { arrayOf, object, string } from 'prop-types'
import uuidv1 from 'uuid/v1'

const Error = ({ err, heading, message }) => (
  <div className="error">
    <h2>{heading}</h2>
    {message.map(p => <p key={uuidv1()}>{p}</p>)}
    {err && <>
      <p>Please copy and email the below information to jonathan.hamilton@wftv.com:</p>
      <code>{JSON.stringify(err, false, 2)}</code>
    </>}
  </div>
)

Error.propTypes = {
  err: object,
  heading: string.isRequired,
  message: arrayOf(string).isRequired
}

export const FetchError = err => <Error
  err={err}
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

export const UploadError = err => <Error
  err={err}
  heading="Error Uploading File!"
  message={[
    'The file may contain errors or an unrecognized codec.'
  ]} />

export const DownloadError = err => <Error
  err={err}
  heading="Unable to Download!"
  message={[
    'Check your internet connection and try again.'
  ]} />

export const RenderError = err => <Error
  err={err}
  heading="Render Failed!"
  message={[
    'Your video was downloaded, but your format settings failed to render.'
  ]} />

export const RecordingError = err => <Error
  err={err}
  heading="Screen Record Failed!"
  message={[
    'Something went wrong. Please check the audio/video configuration of your computer and try again.'
  ]} />

FetchError.propTypes = { err: object }
UploadError.propTypes = { err: object }
DownloadError.propTypes = { err: object }
RenderError.propTypes = { err: object }
RecordingError.propTypes = { err: object }
