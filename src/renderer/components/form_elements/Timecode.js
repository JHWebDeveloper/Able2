import React, { useCallback, useContext } from 'react'
import { string, bool } from 'prop-types'
import { FormContext } from '../../store/formStore'
import { enableTimecode, updateTimecode, pasteTimecode } from '../../actions/form'
import { simplifyTimecode } from '../../utilities'

const Timecode = ({ name, disabled, noLabel }) => {
  const ctx = useContext(FormContext)
  const { dispatch } = ctx
  const { enabled, display } = ctx[name]

  const limitChars = useCallback(e => {
    const colons = e.target.value.match(/:/g) || []
    const regex = colons.length === 2 ? /[0-9]/ : /[:0-9]/

    if (!regex.test(e.key)) e.preventDefault()
  }, [])

  const onChange = useCallback(() => {
    dispatch(enableTimecode(name, enabled))
  })

  return (
    <fieldset className="timecode" disabled={disabled}>
      {noLabel ? (
        <input type="checkbox" onChange={onChange} />
      ) : (
        <label>
          <input type="checkbox" onChange={onChange} />
          {!noLabel && name.charAt(0).toUpperCase() + name.slice(1)}
        </label>
      )}
      <input
        type="text"
        name={name}
        value={display}
        onKeyPress={limitChars}
        onPaste={e => dispatch(pasteTimecode(name, e))}
        onChange={e => dispatch(updateTimecode(name, e.target.value))}
        onBlur={e => dispatch(updateTimecode(name, simplifyTimecode(e.target.value)))}

        disabled={!enabled}
        className="monospace" />
    </fieldset>
  )
}

Timecode.propTypes = {
  name: string.isRequired,
  disabled: bool,
  noLabel: bool
}

export default Timecode