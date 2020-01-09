import { shape, arrayOf, bool, string } from 'prop-types'

export default {
  preferences: shape({
    directories: arrayOf(shape({
      checked: bool.isRequired,
      directory: string.isRequired,
      id: string.isRequired,
      label: string.isRequired
    })),
    outputResolution: string
  })
}
