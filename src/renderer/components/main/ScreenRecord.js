import React, { useCallback, useContext } from 'react'
import { FormContext } from '../../store/formStore'
import { loading, setRecording, setRecordingError, uploadFile } from '../../actions/form'

import Timecode from '../form_elements/Timecode'

const { interop } = window.ABLE2

const ScreenRecord = () => {
  const { recording, timer, dispatch } = useContext(FormContext)

  const startRecording = useCallback(async () => {
    const file = await interop.screenRecorder.start(timer, recording => {
      dispatch(setRecording(recording))
    }, () => {
      dispatch(loading())
    })

    dispatch(uploadFile(file))
  }, [timer])

  const toggleRecording = useCallback(async () => {
    try {
      await (recording ? interop.screenRecorder.stop() : startRecording())
    } catch (err) {
      dispatch(setRecordingError(err))
    }
  }, [recording, timer])

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
