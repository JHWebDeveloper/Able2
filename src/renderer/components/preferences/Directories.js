import React from 'react'
import { arrayOf, bool, func, shape, string } from 'prop-types'

import { addNewDirectory } from '../../actions/preferences'
import Directory from './Directory'

const Directories = ({ directories, dispatch }) => {
  if (directories.length === 0) dispatch(addNewDirectory(0, false))

  return (
    <fieldset name="directories">
      <legend>Save Shortcuts</legend>
      <div className="grid">
        <label id="default">Default</label>
        <label id="label">Label</label>
        <label id="folder">Folder</label>
        {directories.map((dir, i) => (
          <Directory
            key={dir.id}
            index={i}
            dispatch={dispatch}
            dir={dir} />
        ))}
      </div>
    </fieldset>
  )
}

Directories.propTypes = {
  directories: arrayOf(shape({
    checked: bool.isRequired,
    directory: string.isRequired,
    id: string.isRequired,
    label: string.isRequired
  })),
  dispatch: func.isRequired
}

export default Directories
