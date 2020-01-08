import React from 'react'
import uuidv1 from 'uuid/v1'

import Logos from '../svg/Logos'

const services = [
  'YouTube',
  'Twitter',
  'Facebook',
  'Instagram',
  'Vimeo',
  'Twitch',
  'Reddit',
  'Tumblr',
  'Flickr',
  'Dailymotion'
]

const Header = () => (
  <header>
    <h1>Able2</h1>
    {/* {services.map(service => (
      <svg key={uuidv1()}>
        <title>{service}</title>
        <use href={`assets/images/logos.svg#${service.toLowerCase()}`}></use>
      </svg>
    ))}     */}
    <Logos />
    <p>Developed by Jonathan Hamilton</p>
  </header>
)

export default Header