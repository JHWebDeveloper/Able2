import React, { useContext } from 'react'

import { FormContext } from '../../store/formStore'
import * as STATUS from '../../status/types'

import DownloadOptions from './DownloadOptions'
import DownloadProgress from '../progress/DownloadProgress'
import RenderProgress from '../progress/RenderProgress'
import Completed from '../progress/Completed'


export default () => {
  const { status, downloadProgress, renderProgress } = useContext(FormContext)

  switch (status) {
    case STATUS.URL_READY:
    case STATUS.VID_READY:
    case STATUS.IMG_READY:
    case STATUS.BATCH_READY:
      return <DownloadOptions />
    case STATUS.DOWNLOADING:
      return <DownloadProgress {...downloadProgress} />
    case STATUS.RENDERING: 
      return <RenderProgress {...renderProgress} />
    case STATUS.DONE:
      return <Completed />
    default:
      return false
  }
}
