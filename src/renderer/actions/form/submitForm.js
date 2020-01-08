import { CHANGE_STATUS, DOWNLOAD_STARTED, RENDER_STARTED } from '../types'
import { DONE, URL_READY } from '../../status/types'
import { updateProgress, checkDirectory } from '../form' 
import buildSource from './buildSource';
import { cleanSourceName, cleanFileName } from '../../utilities';

const { interop } = window.ABLE2

const download = async (formData, dispatch) => {
  const onDownloadStarted = () => {
    dispatch({ type: DOWNLOAD_STARTED })
  }

  const onDownloadProgress = progress => {
    dispatch(updateProgress('download', progress))
  }

  await interop.download(onDownloadStarted, onDownloadProgress, formData)

  return render(formData, dispatch)
}

const render = async (formData, dispatch) => {
  const onRenderStarted = () => {
    dispatch({ type: RENDER_STARTED })
  }

  const onRenderProgress = progress => {
    dispatch(updateProgress('render', progress))
  }

  return interop.render(onRenderStarted, onRenderProgress, formData)
}

export const submitForm = (state, e) => async dispatch => {
  e.preventDefault()

  let {
    fileName,
    source,
    rotate,
    hflip,
    vflip,
    sourcePrefix,
    sourceOnTop,
    renderOutput,
    directories
  } = state

  let tempDir = false

  if (directories.every(dir => !dir.checked)) {
    const { filePaths, canceled } = await interop.dialog.chooseDirectory()

    if (canceled) return

    tempDir = {
      checked: true,
      directory: filePaths[0]
    }

    state.directories.push(tempDir)
  } else {
    for (let dir of directories) {
      if (!dir.checked) continue

      const exists = await interop.checkIfDirectoryExists(dir.directory)

      if (exists) continue

      const res = await interop.dialog.directoryNotFoundAlert(dir.directory)

      dispatch(checkDirectory(dir.id))

      if (res === 1) return false
    }
  }

  if (source) source = cleanSourceName(source)

  if (hflip) rotate += 'hflip,'
  if (vflip) rotate += 'vflip,'

  const formData = {
    ...state,
    fileName: cleanFileName(fileName),
    sourceDataURL: source
      ? buildSource(sourcePrefix ? `Source: ${source}` : source, renderOutput, sourceOnTop)
      : false
  }

  try {
    await (state.status === URL_READY ? download : render)(formData, dispatch)

    dispatch({
      type: CHANGE_STATUS,
      payload: DONE
    })
  } catch (err) {
    dispatch({
      type: CHANGE_STATUS,
      payload: err
    })
  } finally {
    interop.removeDownloadRenderListeners()
    if (tempDir) state.directories.pop(tempDir)
  }
}