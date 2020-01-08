import React from 'react'

const { interop } = window.ABLE2

const CancelButton = () => (
  <button
    type="button"
    name="cancel"
    title="Cancel"
    onClick={() => interop.cancelProcess()}>Cancel</button>
)

export default CancelButton
