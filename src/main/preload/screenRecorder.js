import { desktopCapturer, remote } from 'electron'
import sendMessage from './sendMessage'

let recorder = false
let timeout = false
let blobs = []

const handleStream = (stream, timer, end, isRecording) => new Promise((resolve, reject) => {
  recorder = new MediaRecorder(stream)

  recorder.onstart = () => {
    isRecording(true)

    if (timer.enabled) {
      timeout = setTimeout(() => {
        stopRecording(end)
        remote.getCurrentWindow().show()
      }, timer.tc * 1000)
    }
  }

  recorder.ondataavailable = e => {
    blobs.push(e.data)
  }

  recorder.onerror = err => {
    reject(err)
    recorder = false
  }

  recorder.addEventListener('stop', () => {
    isRecording(false)
    resolve()
  })

  requestAnimationFrame(() => {
    recorder.start()
  })
})

export const startRecording = async (timer, end, isRecording) => {
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

  await handleStream(media, timer, end, isRecording)
}

export const stopRecording = end => new Promise((resolve, reject) => {
  clearTimeout(timeout)

  recorder.addEventListener('stop', () => {
    toArrayBuffer(new Blob(blobs, { type: 'video/mp4' }), async ab => {
      try {
        const file = await sendMessage({
          sendMsg: 'saveScreenRecord',
          recieveMsg: 'screenRecordSaved',
          errMsg: 'screenRecordSaveErr',
          data: toBuffer(ab)
        })

        resolve(file)
      } catch (err) {
        reject(err)
      }
    }).catch(reject)

    recorder = false
    blobs = []
  })

  recorder.stop()
})

const toArrayBuffer = (blob, callback) => new Promise((resolve, reject) => {
  let fileReader = new FileReader();

  fileReader.onload = () => {
    callback(fileReader.result)
  }

  fileReader.onerror = reject

  fileReader.readAsArrayBuffer(blob)
})

const toBuffer = ab => {
  let buffer = Buffer.alloc(ab.byteLength)
  let arr = new Uint8Array(ab)

  for (let i = 0, len = arr.byteLength; i < len; i++) {
    buffer[i] = arr[i]
  }

  return buffer
}
