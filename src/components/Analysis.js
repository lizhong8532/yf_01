/* global echarts */
import React, { Component } from 'react';
import { Spin, Button } from 'antd';
import axios from 'axios';

import './Analysis.css';

let cache = [];

class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      toggle: '',
      data: []
    };
  }

  getData() {
    if (!this.state.loading) {
      this.setState({loading: true});
      axios.get('/api/getAnalysis')
        .then((res) => {
          this.setState({
            loading: false,
            data: res.data
          });

          setTimeout(() => {
            this.initCharts();
          });

        })
        .catch(() => {
          this.setState({ loading: false })
        });
    }
  }

  initCharts() {
      this.state.data.forEach((item, i) => {
        let myChart = echarts.init(this.refs[`map${i}`]);

        let option = {};
        option.title = { text: item.title };
        option.series = [];

        if (item.header[0].color) {
          option.color = item.header.map((item) => item.color);
        }

        option.grid = {
          top: '120px',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        };

        option.legend = {
          left: 'left',
          top: '40',
          data: item.header.map(item => item.title )
        };

        if (item.rows.length === 1) {
          option.tooltip = {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          };

          option.series.push({
            name: item.title,
            type: 'pie',
            radius: '55%',
            center: ['50%', '65%'],
            data: item.header.map(s => {return { name: s.title, value: item.rows[0][s.key] }})
          });

        } else {
          let labels = [];

          item.header.forEach((item) => {
            option.series.push({
              key: item.key,
              name: item.title,
              type: item.key === 'annualPlan' ? 'line' : 'bar',
              data: []
            });
          });

          item.rows.forEach((item) => {
            labels.push(item.label);
            option.series.forEach((cell) => {
              cell.data.push(item[cell.key]);
            });
          });

          option.yAxis = [{
            type: 'value',
          }];

          if (item.rows[0].annualPlan) {
            option.yAxis[0].max = item.rows[0].annualPlan * 1.2;
          }

          option.xAxis = [{
            type: 'category',
            data: labels,
            axisTick: {
              alignWithLabel: true
            }
          }];

          option.tooltip = {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          }
        }

        myChart.setOption(option);
        cache.push(myChart);
      });
  }

  full(i) {
    this.setState({ toggle: i === this.state.toggle ? '' : i });
  
    setTimeout(() => {
      cache[i].resize();      
    }, 200);
  }

  createChart() {
    //  height: this.refs.root.clientWidth / 2 * 0.7,
    return this.state.data.map((item, i) =>
      <div className={this.state.toggle === i ? 'lz-full' : ''} key={i} style={{ position: 'relative'}}>
        <div ref={`map${i}`} style={{ width: '100%', height: '100%' }} />
        <span className="lz-tool">
          <Button size="large" onClick={() => this.full(i) }>全屏</Button>
        </span>
      </div>
    );
  }

  componentDidMount() {
    cache = [];
    this.getData();

    window.onresize = () => {
      cache.forEach((item) => {
        item.resize();
      });
    };
  }

  render() {
    return (
      <Spin spinning={this.state.loading} tip="Loading...">
        <div className="analysis" ref="root">
          { this.createChart() }
        </div>
      </Spin>
    );
  }
}

export default Analysis;
