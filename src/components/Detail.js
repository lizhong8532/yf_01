/* global echarts */
/* globals BMap */
/* globals BMAP_NORMAL_MAP */
/* globals BMAP_HYBRID_MAP */

import React, { Component } from 'react';
import axios from 'axios';

import { Tabs, Table, Spin, Button, Icon } from 'antd';
import Info from './Info';
import Images from './Images';
import conf from '../config';
import PubSub from 'pubsub-js';
import e from '../event';
import common from './Common'

const TabPane = Tabs.TabPane;
let isInitInvest = false;
let isInitGeo = false;
let _this = null;
let investElement = null;
let geoElement = null;
let map = null;

PubSub.subscribe(e.OPEN_DID_INFO, (msg, id) => {
  document.querySelector('div[role="tab"]').click();  
  _this.getData(id);
});


class Detail extends Component {
  constructor(props) {
    super(props);
    _this = this;
    _this.state = {
      statusMapping: conf.LIGHT_MAPPING,
      loading: false,
      info: [],
      progress: [],
      invest: [],
      geo: {},
      status: { header: [], rows: [] },
      issue: { header: [], rows: [] },
      inspect: { header: [], rows: [] }
    };
  }

  componentDidMount() {
    let id = '';

    if (this.props.id) {
      id = this.props.id;
    } else if (this.props.match &&  this.props.match.params && this.props.match.params.id) {
      id = this.props.match.params.id;
    }

    if (id) {
      this.getData(id);
    }
  }

  getData(id) {
    if (id && !this.state.loading) {
      isInitInvest = false;
      isInitGeo = false;
      this.setState({loading: true});

      // axios.get(`/api/getProject/${this.props.match.params.id}`)
      axios.get(`/api/getProject/${id}`)
        .then((res) => {
          res.data.status.header.filter(item => item.key === 'status').forEach((item) => {
            item.render = (text) => {
              return text ? <span style={{ color: 'green' }}>已完成</span> : <span>未完成</span>;
            };
          });

          res.data.status.header.filter(item => item.key === 'inspect').forEach((item) => {
            item.render = (text) => {
              return text ? <span style={{ color: 'green' }}>是</span> : <span></span>;
            };
          });

          res.data.inspect.header.forEach(item => item.dataIndex = item.key);
          res.data.status.header.forEach(item => item.dataIndex = item.key);
          res.data.issue.header.forEach(item => item.dataIndex = item.key);

          res.data.status.header.filter(item => item.key === 'status').forEach((item) => {
            item.render = (text) => {
              return common.lightIcon(text);
            };
          });

          res.data.status.header.filter(item => item.key === 'flag').forEach((item) => {
            item.render = (text) => {
              return text ? <Icon type="flag" style={{ color: 'red' }} /> : <span></span>;
            };
          });

          this.setState({
            loading: false,
            info: res.data.info,
            progress: res.data.progress,
            invest: res.data.invest,
            status: res.data.status,
            issue: res.data.issue,
            inspect: res.data.inspect,
            geo: res.data.geo
          });

        })
        .catch(() => {
          this.setState({ loading: false })
        });
    }
  }

  initGeo() {
    let div = document.createElement('div');
    div.style.height = (window.innerHeight - 60) + 'px';
    this.refs.geo.innerHTML = '';
    this.refs.geo.appendChild(div);
    geoElement = div;

    let mp = new BMap.Map(div);
    let icon = new BMap.Icon(common.getIcon(this.state.geo.status), new BMap.Size(conf.MAP_ICON_W, conf.MAP_ICON_H));
    let marker = new BMap.Marker(new BMap.Point(this.state.geo.long, this.state.geo.lat), { icon: icon });
    let label = new BMap.Label(this.state.geo.name, {offset:new BMap.Size(20,-10)});

    label.setStyle(conf.MAP_LABEL_STYLE);
    marker.setLabel(label);
    
    mp.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_HYBRID_MAP, BMAP_NORMAL_MAP]}));
    let stCtrl = new BMap.PanoramaControl(); //构造全景控件
    stCtrl.setOffset(new BMap.Size(10, 55));
    mp.addControl(stCtrl);//添加全景控件
    mp.addControl(new BMap.NavigationControl());
    mp.centerAndZoom(new BMap.Point(this.state.geo.long, this.state.geo.lat), 11);
    mp.enableScrollWheelZoom();
    mp.addOverlay(marker);
    map = mp;
  }

  initInvest() {
    let div = document.createElement('div');
    div.style.height =  (window.innerHeight > 460 ? (window.innerHeight - 60) : 400) + 'px';
    this.refs.invest.innerHTML = '';    
    this.refs.invest.appendChild(div); 
    investElement = div;

    let option = {
      title: { text: '项目月度投资' },
      color: ['#006633', '#006699', '#003300', '#330066'],
      legend: {
        // orient: 'vertical',
        left: 'right',
        data: []
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: [],
        axisTick: {
            alignWithLabel: true
        }
      }],
      yAxis: [{
        type: 'value',
        max: common.getMax(this.state.invest.rows)
      }],
      series: []
    };

    this.state.invest.header.forEach((item) => {
      item.type = item.key === 'annualPlan'|| item.key === 'annualTotal' ? 'line' : 'bar';
    });

    let series = this.state.invest.header;

    series.forEach((item) => {
      var title = item.tips ? item.tips : item.title;
      option.legend.data.push(title);
      option.series.push({
        name: title,
        type: item.type,
        data: []
      });
    });

    this.state.invest.rows.forEach((item) => {
      option.xAxis[0].data.push(item.label);
      series.forEach((s, i) => {
        option.series[i].data.push(item[series[i].key]);
      });
    });

    let myChart = echarts.init(div);
    myChart.setOption(option);

    window.onresize = () => {
      investElement.style.height = (window.innerHeight > 260 ? (window.innerHeight - 60) : 200) + 'px';
      myChart.resize();
      
      if (geoElement && map) {
        geoElement.style.height = (window.innerHeight - 60) + 'px';
        // map.resize();
      }
    };
  }

  callback(key) {
    if (key === 'invest' && !isInitInvest) {
      isInitInvest = true;
      setTimeout(() => {
        this.initInvest();
      });
    }

    if (key === 'geo' && !isInitGeo) {
      isInitGeo = true;
      setTimeout(() => {
        this.initGeo();
      });
    }
  }

  render() {
    const operations = this.props.id ? <Button icon="close" onClick={this.props.close}>返回</Button> : null;

    return (
      <Spin spinning={this.state.loading} tip="Loading...">
        <Tabs defaultActiveKey="info" onChange={(key) => this.callback(key)} tabBarExtraContent={operations}>
          <TabPane tab="基础信息" key="info"><Info grid={ this.state.info } /></TabPane>
          <TabPane tab="工作进度" key="progress"><Images data={ this.state.progress } /></TabPane>
          <TabPane tab="项目月度投资" key="invest"><div ref="invest"></div></TabPane>
          <TabPane tab="项目节点状态" key="status"><Table  rowKey="id" dataSource={this.state.status.rows} columns={this.state.status.header} /></TabPane>
          <TabPane tab="项目问题" key="issue"><Table rowKey="id" dataSource={this.state.issue.rows} columns={this.state.issue.header} /></TabPane>
          <TabPane tab="项目督查" key="inspect"><Table rowKey="id" dataSource={this.state.inspect.rows} columns={this.state.inspect.header} /></TabPane>
          <TabPane tab="项目地理位置" key="geo"><div ref="geo"></div></TabPane>
        </Tabs>
      </Spin>
    );
  }
}

export default Detail;
