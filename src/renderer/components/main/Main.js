import React from 'react'

import Header from './Header'
import Form from './Form'
import { FormProvider } from '../../store/formStore';
import PrefsPropType from '../preferences/PrefsPropType';

const Main = ({ preferences }) => (
  <>
    <Header />
    <FormProvider preferences={preferences}>
      <Form />
    </FormProvider>
  </>
)

Main.propTypes = PrefsPropType

export default Main
