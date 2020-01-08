import React, { useContext } from 'react'
import '../../css/index.css'

import Header from './Header'
import Form from './Form'
import { PrefsProvider, PrefsContext } from '../../store/prefsStore';
import { FormProvider } from '../../store/formStore'

const Main = () => {
  const { preferences } = useContext(PrefsContext)

  return (
    <FormProvider preferences={preferences}>
      <Form />
    </FormProvider>
  )
}

const App = () => (
  <>
    <Header />
    <PrefsProvider>
      <Main />
    </PrefsProvider>
  </>
)

export default App
