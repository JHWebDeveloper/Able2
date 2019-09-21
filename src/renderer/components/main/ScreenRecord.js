import React, { useCallback, useContext } from 'react'
import fs from 'fs'
import path from 'path'
import { remote, desktopCapturer } from 'electron'
import { FormContext } from '../../store/formStore'
import { getInfo } from '../../actions/form'
import { START_RECORDING, STOP_RECORDING, CHANGE_STATUS } from '../../actions/types'
import { RECORDING_ERROR } from '../../status/types'

import Timecode from '../elements/Timecode';


let recorder = false
let timeout = false
let blobs = []

const tempDir = process.env.NODE_ENV === 'development'
  ? path.join('src', 'main', 'temp')
  : path.join(remote.app.getPath('temp'), 'able2')

const handleStream = (stream, dispatch, timer, end) => {
  recorder = new MediaRecorder(stream)

  recorder.ondataavailable = e => {
    blobs.push(e.data)
  };

  requestAnimationFrame(() => {
    dispatch({ type: START_RECORDING })
    recorder.start()
  })

  timeout = timer.enabled ? setTimeout(() => {
    stopRecording(dispatch, end)
    remote.getCurrentWindow().show()
  }, timer.tc * 1000) : false
}

const startRecording = (dispatch, timer, end) => {
  desktopCapturer.getSources({
    types: ['screen']
  }).then(async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: process.platform === 'darwin' ? false : {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        },
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            minFrameRate: 60,
            maxFrameRate: 60
          }
        }
      })

      handleStream(media, dispatch, timer, end)
    } catch (err) {
      dispatch({
        type: CHANGE_STATUS,
        payload: RECORDING_ERROR
      })
    }
  })
}

const stopRecording = (dispatch, end) => {
  clearTimeout(timeout)

  recorder.onstop = () => {
    dispatch({ type: STOP_RECORDING })

    toArrayBuffer(new Blob(blobs, { type: 'video/mp4' }), ab => {
      fs.writeFile(path.join(tempDir, 'screen_record.mp4'), toBuffer(ab), err => {
        if (err) throw err

        dispatch(getInfo(false, end, 'fix-screen-record'))
      });
    });

    recorder = false
    blobs = []
  }

  recorder.stop()
}

const toArrayBuffer = (blob, callback) => {
  let fileReader = new FileReader();

  fileReader.onload = () => callback(fileReader.result)
  fileReader.readAsArrayBuffer(blob)
}

const toBuffer = ab => {
  let buffer = Buffer.alloc(ab.byteLength)
  let arr = new Uint8Array(ab)

  for (let i = 0, len = arr.byteLength; i < len; i++) {
    buffer[i] = arr[i]
  }

  return buffer
}

const ScreenRecord = () => {
  const { recording, timer, end, dispatch } = useContext(FormContext)

  const toggleRecording = useCallback(() => {
    recording
      ? stopRecording(dispatch, end)
      : startRecording(dispatch, timer, end)
  })

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
      {process.platform === 'darwin' && <p>(Audio not supported on Mac)</p>}
    </div>
  )
}

export default ScreenRecord
