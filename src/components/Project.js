import React, { Component } from 'react';
import Map from './Map';
import PTable from './PTable';
import axios from 'axios';
import { Spin, Button, Icon } from 'antd';
import PubSub from 'pubsub-js';
import e from '../event';
import Detail from './Detail';

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

let projectId = '';
let isShowDetail = false;

class Project extends Component {

  constructor(props) {
    super(props);
    _this = this;
    _this.state = {
      loading: false,
      currentYear: '',
      currentStatus: '',
      currentBatch: '',
      isShowDetail: false,
      years: [],
      batch: [],
      projectId: '',
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

    projectId = '';
    isShowDetail = false;
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
      if (item[key]) {
        if (!o[item[key]]) {
          o[item[key]] = 0;
        }
        o[item[key]]++;
      }
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
      <Button size="large" onClick={() => this.selectYear(item.year)} key={item.year} type={String(item.year) === this.state.currentYear ? 'primary' : ''}>{item.year}年({item.count})</Button>
    );
  }

  listBatch() {
    return this.state.batch.map((item) => 
      <Button size="large" onClick={() => this.selectBatch(item.batch)} key={item.batch} type={item.batch === this.state.currentBatch ? 'primary' : ''}>{item.batch} ({item.count})</Button>
    );
  }

  listStatus() {
    // return this.state.status.map((item, status) => 
    //   <Button onClick={() => this.selectStatus(status)} key={status} type={String(status) === String(this.state.currentStatus) ? 'primary' : ''}>
    //     {item.text}灯({item.count})
    //   </Button>
    // );
    

    return this.state.status.map((item, status) => 
      <span className="light-btn" onClick={() => this.selectStatus(status)} key={status} type={String(status) === String(this.state.currentStatus) ? 'primary' : ''}>
        <img alt={`${item.text}灯`} src={this.getIcon(status)} /> {item.count}
      </span>
    );
  }

  selectBatch(batch) {
    cacheRows = result.rows.filter(item => !batch || batch === item.batch);

    this.state.status.forEach(item => item.count = 0);
    cacheRows.forEach((item) => this.state.status[item.status].count++);

    this.setState({
      currentBatch: batch,
      statusCount: cacheRows.length,
      projects: {
        header: result.header,
        rows: cacheRows.filter(item => !(this.state.currentStatus + '') || String(this.state.currentStatus) === String(item.status))
      }
    });
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
      let params = {};
      if (this.props.match.params.filter === 'attention') {
        params.isAttention = true;
      }

      if (this.props.match.params.filter === 'batch') {
        params.isBatch = true;        
      } 

      axios.get('/api/getProjects', {params: params})
        .then((res) => {
          let header = res.data.header;

          header.push({
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
                <Button onClick={() => this.openDetail(record.id)}>详情</Button>
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
          result.rows.forEach((item) => {
            if (typeof this.state.status[item.status] === 'number') { 
              this.state.status[item.status].count++;
            }
          });
          cacheRows = result.rows;

          this.setState({
            projects: {
              header: header,
              rows: cacheRows
            },
            currentYear: '',
            currentStatus: '',
            currentBatch: '',
            statusCount: cacheRows.length,
            loading: false,
            years: this.getCountByKey(result.rows, 'year'),
            batch: this.getCountByKey(result.rows, 'batch'),
          });

          if (typeof fn === 'function') {
            fn(result);
          }

          // PubSub.publish(e.PROJECTS_DID_UPDATE, this.state.projects);
        })
        .catch((e) => {
          console.error(e);
          this.setState({ loading: false })
        });
    }
  }

  componentDidMount() {
    this.getData();
  }

  getHeader() {
    if (this.props.match.params.filter === 'batch') {
      return (
        <ButtonGroup>
          <Button size="large" onClick={() => this.selectBatch('')} type={this.state.currentBatch ? '' : 'primary'}>全部({ result.rows.length })</Button>
          { this.listBatch() }
        </ButtonGroup>
      )
    } else {
      return (
        <div>
          <ButtonGroup>
            <Button size="large" onClick={() => this.selectYear('')} type={this.state.currentYear ? '' : 'primary'}>全部({ result.rows.length })</Button>
            { this.listYears() }
          </ButtonGroup>

          <div className="light-btn-group" style={{ marginLeft: '10px' }}>
            <Button size="large" onClick={() => this.selectStatus('')} type={this.state.currentStatus === '' ? 'primary' : ''}>全部({ this.state.statusCount })</Button>
            { this.listStatus() }
          </div>
        </div>
      );
    }
  }

  openDetail(id) {
    // this.setState({
    //   projectId: id,
    //   isShowDetail: true
    // });
    projectId = id;
    isShowDetail = true;

    this.refs.main.style.top = 999999 + 'px';
    this.refs.main.style.position = 'fixed';
    this.refs.detail.style.top = 0;
    this.refs.detail.style.position = 'static';
    PubSub.publish(e.OPEN_DID_INFO, id);
  }

  closeDetail() {
    isShowDetail = false;
    // this.setState({
    //   isShowDetail: false
    // });

    this.refs.main.style.top = 0;
    this.refs.main.style.position = 'static';
    this.refs.detail.style.top = 999999 + 'px';
    this.refs.detail.style.position = 'fixed';
  }

  render() {
    return (
      <Spin spinning={this.state.loading} tip="Loading..." style={{ position: 'relative' }}>
        <div ref='detail' style={{ position: isShowDetail ? 'static' : 'fixed', top: 9999 }} >
        { <Detail close={() => this.closeDetail() } id={projectId} /> }
        </div>
        <div ref='main' style={{ position: isShowDetail ? 'fixed' : 'static', top: 9999  }}>
          <div style={{ marginBottom: '10px' }}>
            <ButtonGroup style={{ position: 'absolute', right: 0 }}>
              <Button size="large" type={this.props.match.params.model === 'map' ? 'danger' : ''}>
                <Link to={`/home/project/list/map/${this.props.match.params.filter}`}>
                  <Icon type="environment" /> 地图
                </Link>
              </Button>
              <Button size="large" type={this.props.match.params.model === 'table' ? 'danger' : ''}>
                <Link to={`/home/project/list/table/${this.props.match.params.filter}`}>
                <Icon type="bars" /> 表格
                </Link>
              </Button>
            </ButtonGroup>

            { this.getHeader() }
          </div>
          <Switch onChange={this.handleChange}>
            <Route path="/home/project/list/map/:filter"  component={ () => <Map detail={(id) => this.openDetail(id)} status={this.state.status} projects={this.state.projects} /> }/>
            <Route path="/home/project/list/table/:filter" component={ () => <PTable detail={(id) => this.openDetail(id)} projects={this.state.projects} /> }/>
          </Switch>
        </div>
      </Spin>

    );
  }
}

export default Project;
