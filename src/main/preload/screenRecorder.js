import { desktopCapturer, remote } from 'electron'
import sendMessage from './sendMessage'

let recorder = false

const handleStream = (stream, timer, isRecording, startLoading) => new Promise((resolve, reject) => {
  const blobs = []
  let timeout = false

  recorder = new MediaRecorder(stream)

  recorder.onstart = () => {
    isRecording(true)

    if (timer.enabled) {
      timeout = setTimeout(() => {
        stopRecording()
        remote.getCurrentWindow().show()
      }, timer.tc * 1000)
    }
  }

  recorder.ondataavailable = e => {
    blobs.push(e.data)
  }

  recorder.onerror = err => {
    clearTimeout(timeout)
    recorder = false
    reject(err)
  }

  recorder.onstop = () => {
    clearTimeout(timeout)
    isRecording(false)
    startLoading()
    resolve(blobs)
  }

  requestAnimationFrame(() => {
    recorder.start()
  })
})

export const startRecording = async (timer, isRecording, startLoading) => {
  await desktopCapturer.getSources({
    types: ['screen']
  })

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

  const blobs = await handleStream(media, timer, isRecording, startLoading)

  return saveRecordingToFile(blobs)
}

export const stopRecording = () => {
  recorder.stop()
}

export const saveRecordingToFile = async blobs => {
  const result = await getBuffer(new Blob(blobs, { type: 'video/mp4' }))

  const file = await sendMessage({
    sendMsg: 'saveScreenRecord',
    recieveMsg: 'screenRecordSaved',
    errMsg: 'screenRecordSaveErr',
    data: result
  })

  recorder = false

  return file
}

const getBuffer = blob => new Promise((resolve, reject) => {
  const fileReader = new FileReader()

  fileReader.onload = () => {
    resolve(toBuffer(fileReader.result))
  }

  fileReader.onerror = reject

  fileReader.readAsArrayBuffer(blob)
})

const toBuffer = ab => {
  const buffer = Buffer.alloc(ab.byteLength)
  const arr = new Uint8Array(ab)

  for (let i = 0, len = arr.byteLength; i < len; i++) {
    buffer[i] = arr[i]
  }

  return buffer
}
