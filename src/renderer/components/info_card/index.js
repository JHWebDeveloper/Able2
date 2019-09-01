import React, { useContext } from 'react'

import { FormContext } from '../../store/formStore'

import VideoInfo from './InfoCard'
import { FetchError, DownloadError, FileError, UploadError, RenderError } from './Error'
import Spinner from '../elements/Spinner'

const Loading = () => (
  <div className="loading">
    <Spinner />
  </div>
)

export default () => {
  const { status, vidData } = useContext(FormContext)

  switch (status) {
    case 'LOADING':
      return <Loading />
    case 'FETCH_ERROR':
      return <FetchError />
    case 'DOWNLOAD_ERROR':
      return <DownloadError />
    case 'FILE_ERROR':
      return <FileError />
    case 'UPLOAD_ERROR':
      return <UploadError />
    case 'RENDER_ERROR':
      return <RenderError />
    case 'URL_READY':
    case 'VID_READY':
    case 'IMG_READY':
    case 'DOWNLOADING':
    case 'RENDERING':
    case 'DONE':
      return <VideoInfo {...vidData} />
    default:
      return false
  }
}
