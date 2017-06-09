/* globals BMap */
/* globals BMAP_NORMAL_MAP */
/* globals BMAP_HYBRID_MAP */

import React, { Component } from 'react';
import { Layout, Card, Icon, Button } from 'antd';
import {
  Link
} from 'react-router-dom';
import conf from '../config';

const { Sider, Content } = Layout;
// const ButtonGroup = Button.Group;

let markersCache = {};

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: {
        header: [],
        rows: []
      }
    };
  }

  initMap() {
    this.mp = new BMap.Map(this.refs.map);
    let centerPoint = this.getCenterPoint();
    this.mp.centerAndZoom(this.getPoint(centerPoint.long, centerPoint.lat), conf.DEFAULT_ZOOM_LEVEL);
    this.mp.enableScrollWheelZoom();
    this.mp.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]}));
    let stCtrl = new BMap.PanoramaControl(); //构造全景控件
	  stCtrl.setOffset(new BMap.Size(10, 40));
	  this.mp.addControl(stCtrl);//添加全景控件
    
  }

  getIcon(status) {
    switch (status) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return `/images/marker_${status}.png`;
      default:
        return '/images/marker_1.png';
    }
  }

  getPoint(long, lat) {
    return new BMap.Point(long, lat);
  }

  getLabel(text, config) {
    return new BMap.Label(text, config);
  }

  getCenterPoint() {
    let point = {};

    if (this.props.projects.rows.length) {
      if (this.props.projects.rows.length >= 2) {
        let minX = 0;
        let minY = 0;
        let maxX = 0;
        let maxY = 0;

        this.props.projects.rows.forEach((item) => {
          minX = minX === 0 ? item.long : Math.min(minX, item.long);
          minY = minY === 0 ? item.lat : Math.min(minY, item.lat);
          maxX = Math.max(maxX, item.long);
          maxY = Math.max(maxY, item.lat);
        });

        point.long = minX + ((maxX - minX) / 2);
        point.lat = minY + ((maxY - minY) / 2);
      } else {
        let item = this.props.projects.rows[0];
        point.long = item.long;
        point.lat = item.lat;
      }
    } else {
      point.long = conf.DEFAULT_LONG;
      point.lat = conf.DEFAULT_LAT;
    }

    return point;
  }

  setMarkers(arr) {
    if (arr instanceof Array) {
      arr.forEach((item) => {
        let icon = new BMap.Icon(this.getIcon(item.status), new BMap.Size(conf.MAP_ICON_W, conf.MAP_ICON_H));
        let marker = new BMap.Marker(this.getPoint(item.long, item.lat), { icon: icon });
        this.mp.addOverlay(marker);
        let label = this.getLabel(item.name, {offset:new BMap.Size(20,-10)});
        marker.setLabel(label);
        markersCache[item.id] = marker;
      });
    }
  }

  cardClick(item) {
    this.mp.panTo(markersCache[item.id].getPosition());
  }

  listItems() {
    if (this.props.projects.rows instanceof Array) {
      return this.props.projects.rows.map((item) => (
        <Card
          onClick={ () => this.cardClick(item) }
          title={ item.name } key={ item.id }
          extra={<Link to={`/home/project/detail/${item.id}`}><Icon type="link" /></Link>}
          style={{ marginTop: '10px', cursor: 'pointer' }}
        >
          <p>年份: { item.year }</p>
          <p>状态: { this.props.status[item.status].text }灯 <img alt={ item.status } height="20" src={this.getIcon(item.status)} /></p>
          <p>
              <a rel="noopener noreferrer" href={`/home/project/detail/${item.id}`} target="_blank"><Button size="small" icon="link">查看详情</Button></a>
          </p>
          <p>
              <Button size="small" icon="compass">定位</Button>            
          </p>
        </Card>
      ));
    } else {
      return [];
    }
  }

  clearMarkers() {
    this.mp.clearOverlays();
    markersCache = {};
  }

  componentDidMount() {
    this.initMap();

    if (this.props.projects.rows.length) {
      this.setMarkers(this.props.projects.rows);
    }
  }

  render() {
    return (
      <Layout style={{ height: window.innerHeight - conf.HEADER_HEIGHT - 75, overflow: 'hidden' }}>
        <Content style={{ height: "100%" }}>
          <div ref="map" style={{ height: "100%" }}></div>
        </Content>
        <Sider style={{ height: '100%', overflow: 'auto' }}>
          <div style={{ padding: '10px' }}>
            { this.listItems() }
          </div>
        </Sider>
      </Layout>
    );
  }
}

export default Map;
