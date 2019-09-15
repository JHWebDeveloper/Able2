import React, { useContext, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import { FormContext } from '../../store/formStore'
import { submitForm, syncPreferences  } from '../../actions/form'

import Fetcher from './Fetcher'
import Uploader from './Uploader'
import InfoCard from '../info_card'
import DownloadOptions from '../download_options'
import ScreenRecord from './ScreenRecord'
import Updater from '../progress/Updater'

const Form = () => {
  const ctx = useContext(FormContext)
  const { dispatch, status } = ctx

  useEffect(() => {
    ipcRenderer.once('sync-prefs', (evt, data) => {
      dispatch(syncPreferences(data))
    })
    
    return () => (
      ipcRenderer.removeAllListeners(['sync-prefs'])
    )
  })

  return (
    <main>
      <Updater />
      <form onSubmit={e => dispatch(submitForm(ctx, e))}>
        {status && !status.endsWith('ERROR') ? false : (
          <fieldset disabled={ctx.recording}>
            <Fetcher />
            <Uploader />
          </fieldset>
        )}
        <InfoCard />
        <DownloadOptions />
        {status && !status.endsWith('ERROR') ? false : <ScreenRecord />}
      </form>
    </main>
  )
}

export default Form