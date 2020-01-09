import React from 'react'
import { bool, number, oneOfType, string } from 'prop-types'

const InfoCard = props => {
  const { thumbnail, title, duration, resolution, fps, fileCount } = props

  return (
    <div className="video-info">
      <img
        src={thumbnail}
        alt={title} />
      <div>
        <h2>{title}</h2>
        <ul>
          {duration && duration !== '00:00:00' && <li>{duration}</li>}
          {resolution && <li>{resolution}</li>}
          {fps && <li>{`${fps}fps`}</li>}
          {fileCount && <li>{`${fileCount} Files`}</li>}
        </ul>
      </div>
    </div>
  )
}

InfoCard.propTypes = {
  thumbnail: string,
  title: string,
  duration: string,
  resolution: oneOfType([bool, string]),
  fps: oneOfType([string, number]),
  fileCount: number
}

export default InfoCard
