import React, { createRef, useCallback, useContext } from 'react'
import path from 'path'
import { FormContext } from '../../store/formStore'
import { getInfo } from '../../actions/form'

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
  '.mxf',
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
    if (!accepted.includes(path.extname(e.target.files[0].name.toLowerCase()))) {
      e.preventDefault()

      dispatch({
        type: 'CHANGE_STATUS',
        payload: 'FILE_ERROR'
      })
    } else {
      dispatch(getInfo(e.target.files[0], endData, 'upload'))
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
      <p>...or drag and drop file here</p>
      <input
        type="file"
        onChange={e => checkFileType(e, end)}
        onDragEnter={dragOver}
        onDragLeave={dragOut}
        onDrop={dragOut}
        accept={accepted.join()} />
    </div>
  )
}

export default FileUpload
