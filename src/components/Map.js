/* globals BMap */
/* globals BMAP_NORMAL_MAP */
/* globals BMAP_HYBRID_MAP */

import React, { Component } from 'react';
import { Layout, Card, Icon, Button } from 'antd';
import {
  Link
} from 'react-router-dom';
import conf from '../config';
import scrollIntoView from 'scroll-into-view';
import common from './Common';

const { Sider, Content } = Layout;
// const ButtonGroup = Button.Group;

let markersCache = {};
let labelsCache = {};

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: {
        header: [],
        rows: []
      }
    };

    markersCache = {};
    labelsCache = {};
  }

  initMap() {
    this.mp = new BMap.Map(this.refs.map);
    let centerPoint = this.getCenterPoint();
    this.mp.centerAndZoom(this.getPoint(centerPoint.long, centerPoint.lat), conf.DEFAULT_ZOOM_LEVEL);
    this.mp.enableScrollWheelZoom();
    this.mp.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]}));
    this.mp.addControl(new BMap.NavigationControl());
    let stCtrl = new BMap.PanoramaControl(); //构造全景控件
	  stCtrl.setOffset(new BMap.Size(10, 55));
	  this.mp.addControl(stCtrl);//添加全景控件
    
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
          if (item.long && item.lat) {
            minX = minX === 0 ? item.long : Math.min(minX, item.long);
            minY = minY === 0 ? item.lat : Math.min(minY, item.lat);
            maxX = Math.max(maxX, item.long);
            maxY = Math.max(maxY, item.lat);
          }
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
      arr.filter((item) => item.long && item.lat).forEach((item, i) => {
        let icon = new BMap.Icon(common.getIcon(item.status), new BMap.Size(conf.MAP_ICON_W, conf.MAP_ICON_H));
        let marker = new BMap.Marker(this.getPoint(item.long, item.lat), { icon: icon });
        this.mp.addOverlay(marker);
        let label = this.getLabel(item.name, {offset:new BMap.Size(20,-10)});
        label.setStyle(conf.MAP_LABEL_STYLE);
        // marker.setLabel(label);
        markersCache[item.id] = marker;
        labelsCache[item.id] = label;
        
        label.addEventListener('click', () => {
          this.scrollToItem(item, i);
        });

        label.addEventListener('dblclick', () => {
          this.props.detail(item.id);
        });

        marker.addEventListener('click', () => {
          this.showLabel(item);
          this.scrollToItem(item, i);
        });

        marker.addEventListener('dblclick', () => {
          this.props.detail(item.id);
        });
      });
    }
  }

  showLabel(item) {
    Object.keys(markersCache).forEach((key) => {
      if (markersCache[key].getLabel()) {
        this.mp.removeOverlay(markersCache[key].getLabel());
      }
    });

    markersCache[item.id].setLabel(labelsCache[item.id]);
  }

  scrollToItem(item, i) {
    document.querySelectorAll('.ant-card').forEach((element, index) => {
      if (i === index) {
        scrollIntoView(element);
      }
    });
  }

  cardClick(item) {
    this.showLabel(item);
    this.mp.panTo(markersCache[item.id].getPosition());
  }

  listItems() {
    if (this.props.projects.rows instanceof Array) {
      return this.props.projects.rows.map((item) => (
        <Card
          title={ item.name } key={ item.id }
          extra={<Link to={`/home/project/detail/${item.id}`}><Icon type="link" /></Link>}
          style={{ marginBottom: '10px', cursor: 'pointer' }}
        >
          <p>年份: { item.year }</p>
          <p>状态: { conf.LIGHT_MAPPING[item.status].text }灯</p>
          <div style={{ marginTop: 5 }}>
            <Button size="large" onClick={() => this.props.detail(item.id)}>详情</Button>
          </div>
          <div style={{ marginTop: 5 }}>
            <Button size="large" onClick={() => this.cardClick(item)}>定位</Button>
          </div>
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
      <Layout style={{ minHeight: 500, height: window.innerHeight - conf.HEADER_HEIGHT - 80, overflow: 'hidden' }}>
        <Content style={{ height: "100%" }}>
          <div ref="map" style={{ height: "100%", width: '100%' }}></div>
        </Content>
        <Sider className="lz-map-sider" style={{ height: '100%', overflow: 'auto' }}>
          <div style={{ padding: '10px' }}>
            { this.listItems() }
          </div>
        </Sider>
      </Layout>
    );
  }
}

export default Map;
