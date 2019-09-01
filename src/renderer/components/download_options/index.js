import React, { useContext } from 'react'

import { FormContext } from '../../store/formStore'

import DownloadOptions from './DownloadOptions'
import DownloadProgress from '../progress/DownloadProgress'
import RenderProgress from '../progress/RenderProgress'
import Completed from '../progress/Completed';

export default () => {
  const { status, downloadProgress, renderProgress } = useContext(FormContext)

  switch (status) {
    case 'URL_READY':
    case 'VID_READY':
    case 'IMG_READY':
        return <DownloadOptions />
    case 'DOWNLOADING':
      return <DownloadProgress {...downloadProgress} />
    case 'RENDERING': 
      return <RenderProgress {...renderProgress} />
    case 'DONE':
      return <Completed />
    default:
      return false
  }
}
