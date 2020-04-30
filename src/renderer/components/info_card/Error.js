import React from 'react'
import { string, arrayOf } from 'prop-types'
import uuidv1 from 'uuid/v1'

const Error = ({ heading, message, err }) => (
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
  heading: string.isRequired,
  message: arrayOf(string).isRequired
}

export const FetchError = () => <Error heading="Video Not Found!" message={[
  'The URL you submitted may be invalid or no longer available.',
  'If not, check your internet connection.'
]}/>

export const FileError = () => <Error heading="Unsupported File Type!" message={[
  'The file you attempted to upload is not compatible with Able2.'
]}/>

export const UploadError = () => <Error heading="Error Uploading File!" message={[
  'The file may contain errors or an unrecognized codec.'
]}/>

export const DownloadError = err => <Error heading="Unable to Download!" message={[
  'Check your internet connection and try again.'
]} err={err} />

export const RenderError = err => <Error heading="Render Failed!" message={[
  'Your video was downloaded, but your format settings failed to render.'
]} err={err} />

export const RecordingError = () => <Error heading="Screen Record Failed!" message={[
  'Something went wrong. Please check the audio/video configuration of your computer and try again.'
]}/>
