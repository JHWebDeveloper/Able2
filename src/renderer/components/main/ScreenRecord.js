import React, { useCallback, useContext } from 'react'
import { FormContext } from '../../store/formStore'
import { loading, setRecording, setRecordingError, uploadFile } from '../../actions/form'

import Timecode from '../form_elements/Timecode'

const { interop } = window.ABLE2

const ScreenRecord = () => {
  const { recording, timer, end, dispatch } = useContext(FormContext)

  const startRecording = useCallback(() => (
    interop.screenRecorder.start(timer, end, recording => {
      dispatch(setRecording(recording))
    })
  ), [timer, end])

  const stopRecording = useCallback(async () => {
    dispatch(loading())

    const files = await interop.screenRecorder.stop(end)

    dispatch(uploadFile(await files))
  }, [end])

  const toggleRecording = useCallback(async () => {
    try {
      await (recording ? stopRecording() : startRecording())
    } catch (err) {
      dispatch(setRecordingError())
    }
  }, [recording, timer, end])

  return (
    <div className="screen-record">
      <p>{recording ? 'Recording' : '...or start a screen record'}</p>
      <button
        type="button"
        name="record"
        title={`${recording ? 'Stop' : 'Start'} Record`}
        className={recording ? 'recording' : ''}
        onClick={toggleRecording}></button>
      <Timecode name="timer" disabled={recording} noLabel />
      {interop.isMac && <p>(Audio not supported on Mac)</p>}
    </div>
  )
}

export default ScreenRecord
