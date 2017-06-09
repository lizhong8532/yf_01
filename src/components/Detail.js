/* global echarts */
/* globals BMap */
/* globals BMAP_NORMAL_MAP */
/* globals BMAP_HYBRID_MAP */

import React, { Component } from 'react';
import axios from 'axios';

import { Tabs, Table, Spin } from 'antd';
import Info from './Info';
import Images from './Images';
import conf from '../config';

const TabPane = Tabs.TabPane;
let isInitInvest = false;
let isInitGeo = false;

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.getData();
  }

  getData() {
    if (!this.state.loading) {
      this.setState({loading: true});
      axios.get(`/api/getProject/${this.props.match.params.id}`)
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

  initGeo() {
    let mp = new BMap.Map(this.refs.geo);
    let icon = new BMap.Icon(this.getIcon(this.state.geo.status), new BMap.Size(conf.MAP_ICON_W, conf.MAP_ICON_H));
    let marker = new BMap.Marker(new BMap.Point(this.state.geo.long, this.state.geo.lat), { icon: icon });

    mp.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_HYBRID_MAP, BMAP_NORMAL_MAP]}));
    let stCtrl = new BMap.PanoramaControl(); //构造全景控件
	  stCtrl.setOffset(new BMap.Size(10, 40));
	  mp.addControl(stCtrl);//添加全景控件

    mp.centerAndZoom(new BMap.Point(this.state.geo.long, this.state.geo.lat), 11);
    mp.enableScrollWheelZoom();
    mp.addOverlay(marker);
    marker.setLabel(new BMap.Label(this.state.geo.name, {offset:new BMap.Size(20,-10)}));
  }

  initInvest() {
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
        max: this.state.invest.rows[0].annualPlan * 1.2
      }],
      series: []
    };

    this.state.invest.header.forEach((item) => {
      item.type = item.key === 'annualPlan' ? 'line' : 'bar';
    });

    let series = this.state.invest.header;

    series.forEach((item) => {
      option.legend.data.push(item.title);
      option.series.push({
        name: item.title,
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

    let myChart = echarts.init(this.refs.invest);
    myChart.setOption(option);
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
    return (
      <Spin spinning={this.state.loading} tip="Loading...">
        <Tabs defaultActiveKey="info" onChange={(key) => this.callback(key)}>
          <TabPane tab="基础信息" key="info"><Info grid={ this.state.info } /></TabPane>
          <TabPane tab="工作进度" key="progress"><Images data={ this.state.progress } /></TabPane>
          <TabPane tab="项目月度投资" key="invest"><div ref="invest" style={{ height: window.innerHeight - 150 }}></div></TabPane>
          <TabPane tab="项目节点状态" key="status"><Table  rowKey="id" dataSource={this.state.status.rows} columns={this.state.status.header} /></TabPane>
          <TabPane tab="项目问题" key="issue"><Table rowKey="id" dataSource={this.state.issue.rows} columns={this.state.issue.header} /></TabPane>
          <TabPane tab="项目督查" key="inspect"><Table rowKey="id" dataSource={this.state.inspect.rows} columns={this.state.inspect.header} /></TabPane>
          <TabPane tab="项目地理位置" key="geo"><div ref="geo" style={{ height: window.innerHeight - 100 }}></div></TabPane>
        </Tabs>
      </Spin>
    );
  }
}

export default Detail;
