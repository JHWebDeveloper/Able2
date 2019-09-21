import React, { useContext } from 'react'

import { FormContext } from '../../store/formStore'
import * as STATUS from '../../status/types'

import VideoInfo from './InfoCard'
import Spinner from '../elements/Spinner'

import {
  FetchError,
  DownloadError,
  FileError,
  UploadError,
  RenderError,
  RecordingError
} from './Error'

const Loading = () => (
  <div className="loading">
    <Spinner />
  </div>
)

export default () => {
  const { status, vidData } = useContext(FormContext)

  switch (status) {
    case STATUS.LOADING:
      return <Loading />
    case STATUS.FETCH_ERROR:
      return <FetchError />
    case STATUS.DOWNLOAD_ERROR:
      return <DownloadError />
    case STATUS.FILE_ERROR:
      return <FileError />
    case STATUS.UPLOAD_ERROR:
      return <UploadError />
    case STATUS.RENDER_ERROR:
      return <RenderError />
    case STATUS.RECORDING_ERROR:
      return <RecordingError />
    case STATUS.URL_READY:
    case STATUS.VID_READY:
    case STATUS.IMG_READY:
    case STATUS.BATCH_READY:
    case STATUS.DOWNLOADING:
    case STATUS.RENDERING:
    case STATUS.DONE:
      return <VideoInfo {...vidData} />
    default:
      return false
  }
}
