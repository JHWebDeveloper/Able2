import React from 'react'
import { string, number, oneOfType } from 'prop-types'

const InfoCard = ({ thumbnail, title, duration, resolution, fps, fileCount }) => {
  const errImg = require('../../images/able2-placeholder.svg');
  const onError = e => {
    e.target.src = errImg
    e.target.onError = ''
  }

  return (
    <div className="video-info">
      <img
        src={thumbnail || errImg}
        alt={title}
        onError={onError} />
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
  resolution: string,
  fps: oneOfType([string, number]),
  fileCount: oneOfType([string, number])
}

export default InfoCard
