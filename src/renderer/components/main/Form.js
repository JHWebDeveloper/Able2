import React, { useContext } from 'react'

import { FormContext } from '../../store/formStore'
import { submitForm } from '../../actions/form'
import { INIT, ERROR } from '../../status/types'

import Update from '../update/Update'
import Fetcher from './Fetcher'
import Uploader from './Uploader'
import InfoCard from '../info_card'
import DownloadOptions from '../download_options'
import ScreenRecord from './ScreenRecord'

const Form = () => {
  const ctx = useContext(FormContext)
  const { status, recording, dispatch } = ctx
  const init = status === INIT || status.endsWith(ERROR)

  return (
    <main>
      <Update />
      <form onSubmit={e => dispatch(submitForm(ctx, e))}>
        {init ? (
          <fieldset disabled={recording}>
            <Fetcher />
            <Uploader />
          </fieldset>
        ) : false}
        <InfoCard />
        <DownloadOptions />
        {init ? <ScreenRecord /> : false}
      </form>
    </main>
  )
}

export default Form