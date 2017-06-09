import React, { Component } from 'react';
import Map from './Map';
import PTable from './PTable';
import axios from 'axios';
import { Spin, Button } from 'antd';
import PubSub from 'pubsub-js';
import e from '../event';

import {
  Route,
  Link,
  Switch
} from 'react-router-dom';

const ButtonGroup = Button.Group;
let _this = null;

PubSub.subscribe(e.SIDEBAR_CLICK, (msg, item) => {
  if (item.url.indexOf('/home/project/list') === 0) {
    _this.getData();
  }
});

let result = {
  rows: []
};

let cacheRows = [];

class Project extends Component {

  constructor(props) {
    super(props);
    _this = this;
    _this.state = {
      loading: false,
      currentYear: '',
      currentStatus: '',
      years: [],
      status: [
        { text: '红', color: 'red', count: 0 },
        { text: '黄', color: 'yellow', count: 0 },
        { text: '绿', color: 'green', count: 0 },
        { text: '蓝', color: 'blue', count: 0 },
        { text: '白', color: 'white', count: 0 }
      ],
      statusCount: 0,
      projects: {
        rows: [],
        header: []
      }
    };
  }

  lightIcon = (status, size = '20px') => (
    <div style={{
      height: size,
      width: size,
      background: this.state.status[status].color,
      boxShadow: '0 0 3px 3px #CCC',
      borderRadius: '50%',
      display: 'inline-block'
    }} />
  )

  getIcon(status) {
    switch (status) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        return `/images/marker_${status}.png`;
      default:
        return '/images/marker_1.png';
    }
  }

  getCountByKey(arr, key) {
    let o = {};
    arr.forEach((item) => {
      if (!o[item[key]]) {
        o[item[key]] = 0;
      }
      o[item[key]]++;
    });

    return Object.keys(o).sort((a, b) => a > b).map(k => {
      let obj = {};
      obj[key] = k;
      obj.count = o[k];
      return obj;
    });
  }

  listYears() {
    return this.state.years.map((item) => 
      <Button onClick={() => this.selectYear(item.year)} key={item.year} type={String(item.year) === this.state.currentYear ? 'primary' : ''}>{item.year}年({item.count})</Button>
    );
  }

  listStatus() {
    return this.state.status.map((item, status) => 
      <Button onClick={() => this.selectStatus(status)} key={status} type={String(status) === String(this.state.currentStatus) ? 'primary' : ''}>
        {item.text}灯({item.count})
      </Button>
    );
  }

  selectYear(year) {
    cacheRows = result.rows.filter(item => !year || year === String(item.year));

    this.state.status.forEach(item => item.count = 0);
    cacheRows.forEach((item) => this.state.status[item.status].count++);

    this.setState({
      currentYear: year,
      statusCount: cacheRows.length,
      projects: {
        header: result.header,
        rows: cacheRows.filter(item => !(this.state.currentStatus + '') || String(this.state.currentStatus) === String(item.status))
      }
    });
  }

  selectStatus(status) {
    this.setState({
      currentStatus: status,
      projects: {
        header: result.header,
        rows: cacheRows.filter(item => !(status + '') || status + '' === String(item.status))
      }
    });
  }

  getData(fn) {
    if (!this.state.loading) {

      this.setState({loading: true});
      axios.get('/api/getProjects', {params: {isAttention: this.props.match.params.filter === 'attention'}})
        .then((res) => {
          let header = res.data.header;

          header.push({
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
                <a rel="noopener noreferrer" href={`/home/project/detail/${record.id}`} target="_blank">详情</a>
              </span>
            ),
          });

          header.forEach((item) => item.dataIndex = item.key);

          header.filter(item => item.key === 'isAttention').forEach((item) => {
            item.render = (text) => {
              return text ? <span style={{ color: 'green' }}>是</span> : <span>否</span>;
            };
          });

          header.filter(item => item.key === 'status').forEach((item) => {
            item.render = (text) => {
              return this.lightIcon(text);
            };
          });

          header.filter(item => /long|lat/.test(item.key)).forEach((item) => {
            item.render = (text) => {
              return text.toFixed(4);
            };
          });

          res.data.rows.filter(item => !item.key).map((item) => item.key = item.id);

          result = res.data;
          result.rows.forEach((item) => this.state.status[item.status].count++);
          cacheRows = result.rows;

          this.setState({
            projects: {
              header: header,
              rows: cacheRows
            },
            currentYear: '',
            currentStatus: '',
            statusCount: cacheRows.length,
            loading: false,
            years: this.getCountByKey(result.rows, 'year')
          });

          if (typeof fn === 'function') {
            fn(result);
          }

          // PubSub.publish(e.PROJECTS_DID_UPDATE, this.state.projects);
        })
        .catch(() => {
          this.setState({ loading: false })
        });
    }
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <Spin spinning={this.state.loading} tip="Loading...">
        <div style={{ marginBottom: '10px' }}>
          <ButtonGroup>
            <Button type={this.props.match.params.model === 'map' ? 'danger' : ''}>
              <Link to={`/home/project/list/map/${this.props.match.params.filter}`}>地图</Link>
            </Button>
            <Button type={this.props.match.params.model === 'table' ? 'danger' : ''}>
              <Link to={`/home/project/list/table/${this.props.match.params.filter}`}>表格</Link>
            </Button>
          </ButtonGroup>

          <ButtonGroup style={{ marginLeft: '10px' }}>
            <Button onClick={() => this.selectYear('')} type={this.state.currentYear ? '' : 'primary'}>全部({ result.rows.length })</Button>
            { this.listYears() }
          </ButtonGroup>

          <ButtonGroup style={{ marginLeft: '10px' }}>
            <Button onClick={() => this.selectStatus('')} type={this.state.currentStatus === '' ? 'primary' : ''}>全部({ this.state.statusCount })</Button>
            { this.listStatus() }
          </ButtonGroup>
        </div>
        <Switch onChange={this.handleChange}>
          <Route path="/home/project/list/map/:filter"  component={ () => <Map status={this.state.status} projects={this.state.projects} /> }/>
          <Route path="/home/project/list/table/:filter" component={ () => <PTable projects={this.state.projects} /> }/>
        </Switch>
      </Spin>

    );
  }
}

export default Project;
