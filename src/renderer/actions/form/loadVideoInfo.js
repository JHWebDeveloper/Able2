import { secondsToTC } from '../../utilities'

export const loadVideoInfo = (info, end, dispatch) => {
  const { duration, title, width, height } = info
  const hhmmss = secondsToTC(duration || 0)
  const is16_9 = height / width === 0.5625

  dispatch({
    type: 'UPDATE_STATE',
    payload: {
      status: info.readyStatus,
      fileName: info.readyStatus === 'BATCH_READY' ? '' : title,
      vidData: {
        ...info,
        is16_9,
        duration: hhmmss,
        resolution: width && height
          ? `${width}x${height}`
          : false
      },
      end: {
        ...end,
        display: hhmmss,
        tc: duration || 0
      }
    }
  })
}