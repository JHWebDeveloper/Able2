import React, { createRef, useCallback, useContext } from 'react'
import { FormContext } from '../../store/formStore'
import { loading, uploadFile, setFileError } from '../../actions/form'

const { interop } = window.ABLE2
const ref = createRef()

const accepted = [
  //videos
  '.avi',
  '.flv',
  '.mkv',
  '.mov',
  '.mpeg',
  '.mpg',
  '.mp4',
  '.mts',
  '.mxf',
  '.m2ts',
  '.m2v',
  '.m4v',
  '.ogg',
  '.ogv',
  '.vob',
  '.webm',
  '.wmv',
  '.3gp',
  '.3g2',
  //images
  '.bmp',
  '.gif',
  '.jfif',
  '.jpeg',
  '.jpg',
  '.jp2',
  '.png',
  '.tga',
  '.tif',
  '.tiff',
  '.webp'
]

const FileUpload = () => {
  const { end, dispatch } = useContext(FormContext)

  const checkFileType = useCallback((e, endData) => {
    const files = Array
      .from(e.target.files)
      .map(({ name, path }) => ({ name, path }))

    const validExtensions = files.every(file => (
      accepted.includes(interop.getExtName(file.name)))
    )

    if (!validExtensions) {
      e.preventDefault()

      dispatch(setFileError())
    } else {
      dispatch(loading())
      dispatch(uploadFile(files, endData, 'upload'))
    }
  }, [])

  const dragOver = useCallback(() => {
    ref.current.classList.add('drag-enter')
  }, [])

  const dragOut = useCallback(() => {
    ref.current.classList.remove('drag-enter')
  }, [])

  return (
    <div ref={ref} className="file-uploader">
      <p>...or drag and drop file(s) here</p>
      <input
        type="file"
        onChange={e => checkFileType(e, end)}
        onDragEnter={dragOver}
        onDragLeave={dragOut}
        onDrop={dragOut}
        accept={accepted.join()}
        multiple />
    </div>
  )
}

export default FileUpload
