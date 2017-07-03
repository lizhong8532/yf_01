import conf from '../config.js';
import React from 'react';

const common = {
  getIcon(status) {
    switch (Number(status)) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        return `/images/marker_${status}.png`;

      case 5:
      case 6:
        return `/images/marker_${status}.gif`;
        
      default:
        return '/images/marker_0.png';
    }
  },

  lightIcon(status, size = '20px') {
    let className = '';
    if (status >= 5) {
      className = 'lz-blink';
    }
    return (
      <div className={ className } style={{
        height: size,
        width: size,
        background: conf.LIGHT_MAPPING[status] ? conf.LIGHT_MAPPING[status].color : 'none',
        boxShadow: '0 0 3px 3px #CCC',
        borderRadius: '50%',
        display: conf.LIGHT_MAPPING[status] ? 'inline-block' : 'none'
      }} />
    )
  }
};

export default common;
