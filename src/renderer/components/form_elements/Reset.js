import React, { useContext } from 'react'

import { FormContext } from '../../store/formStore'
import { resetForm } from '../../actions/form'
import { DONE } from '../../status/types'

const Reset = () => {
  const { status, dispatch } = useContext(FormContext)

  return (
    <button
      type="button"
      title="Start Over"
      onClick={() => dispatch(resetForm(status !== DONE))}>
      Start Over
    </button>
  )
}

export default Reset
