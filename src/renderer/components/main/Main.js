import React from 'react'

import Header from './Header'
import Form from './Form'
import { FormProvider } from '../../store/formStore';

const Main = ({ preferences }) => (
  <>
    <Header />
    <FormProvider preferences={preferences}>
      <Form />
    </FormProvider>
  </>
)

export default Main
