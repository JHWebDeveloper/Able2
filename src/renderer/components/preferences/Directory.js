import React from 'react'
import { shape, string, number, bool, func } from 'prop-types'

import {
  checkDefault,
  addNewDirectory,
  deleteDirectoryWarn,
  updateLabel,
  chooseDirectory,
  moveDirectory
} from '../../actions/preferences'

const Directory = ({ dir, index, dispatch }) => {
  const { checked, label, directory, id } = dir

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => dispatch(checkDefault(id))} />
      </td>
      <td>
        <button
          name="add"
          title="Add directory"
          onClick={e => dispatch(addNewDirectory(index, e))}>
          <svg>
            <use href="assets/images/buttons.svg#add"></use>
          </svg>
        </button>
        <button
          name="delete"
          title="Delete directory"
          onClick={() => dispatch(deleteDirectoryWarn(id, label))}>
          <svg>
            <use href="assets/images/buttons.svg#delete"></use>
          </svg>
        </button>
      </td>
      <td>
        <input
          type="text"
          name="label"
          value={label}
          onChange={e => dispatch(updateLabel(id, e))} />
      </td>
      <td>
        <button
          title="Choose directory"
          onClick={() => dispatch(chooseDirectory(id))}>
          <svg>
            <use href="assets/images/buttons.svg#folder"></use>
          </svg>
        </button>
        <input
          type="text"
          name="directory"
          value={directory}
          readOnly />
      </td>
      <td>
        <button
          name="up"
          title="Move directory up"
          onClick={() => dispatch(moveDirectory(dir, index - 1))}>
          <svg>
            <use href="assets/images/buttons.svg#up"></use>
          </svg>
        </button>
        <button
          name="down"
          title="Move directory down"
          onClick={() => dispatch(moveDirectory(dir, index + 1))}>
          <svg>
            <use href="assets/images/buttons.svg#down"></use>
          </svg>
        </button>
      </td>
    </tr>
  )
}

Directory.propTypes = {
  dir: shape({
    checked: bool.isRequired,
    label: string.isRequired,
    directory: string.isRequired,
    id: string.isRequired
  }).isRequired,
  index: number.isRequired,
  dispatch: func.isRequired
}

export default Directory
