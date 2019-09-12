import React from 'react'

const InfoCard = ({ thumbnail, title, duration, resolution, fps, fileCount }) => {
  const errImg = require('../../images/able2-placeholder.svg');
  const onError = ({ target }) => {
    target.src = errImg
    target.onError = ''
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
          {fileCount && <li>{`${fileCount} Files Queued`}</li>}
        </ul>
      </div>
    </div>
  )
}

export default InfoCard
