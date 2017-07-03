/* globals BMap */

import React, { Component } from 'react';

class Panorama extends Component {
  initMap() {
    const panorama = new BMap.Panorama(this.refs.map);

    if (this.props.match.params.id.indexOf(',') >= 0) {
      const arr = this.props.match.params.id.split(',');
      panorama.setPosition(new BMap.Point(arr[0], arr[1]));
    } else {
      panorama.setId(this.props.match.params.id);
    } 
  }

  componentDidMount() {
    this.initMap();
    window.onresize = () => {
      this.refs.map.style.height = window.innerHeight + 'px';
    };
  }

  render() {

    return (
      <div ref="map" style={{ height: window.innerHeight, width: '100%' }}></div>
    );
  }
}

export default Panorama;
