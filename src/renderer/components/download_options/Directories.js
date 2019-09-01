import React, { useContext } from 'react'

import { FormContext } from '../../store/formStore';
import { checkDirectory } from '../../actions/form'

const Directories = () => {
  const { directories, dispatch } = useContext(FormContext)
  
  return (
    <fieldset name="save-options">
      {directories.map(({ id, checked, label }) => (
        <label key={id}>
          <input
            type="checkbox"
            onChange={() => dispatch(checkDirectory(id))}
            checked={checked}/>
          {label}
        </label>
      ))}
    </fieldset>
  )
}

export default Directories