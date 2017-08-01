import React, { Component } from 'react';
import Map from './Map';
import PTable from './PTable';
import axios from 'axios';
import { Spin, Button, Icon } from 'antd';
import PubSub from 'pubsub-js';
import e from '../event';
import Detail from './Detail';
import conf from '../config';
import common from './Common'

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
      isShowDetail: false,
      projectId: '',
      filter: [],
      projects: {
        rows: [],
        header: []
      }
    };

    projectId = '';
    isShowDetail = false;
  }

  getCountByKey(arr, key) {
    let o = {};
    arr.forEach((item) => {
      if (item[key] !== undefined) {
        if (!o[item[key]]) {
          o[item[key]] = 0;
        }
        o[item[key]]++;
      }
    });

    return Object.keys(o).sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a > b;
      } else if (conf.ORDER_MAPPING[a.substr(0, 2)] && conf.ORDER_MAPPING[b.substr(0, 2)]) {
        return conf.ORDER_MAPPING[a.substr(0, 2)] > conf.ORDER_MAPPING[b.substr(0, 2)];
      } else {
        return 0;
      }
    }).map(k => {
      let obj = {};
      let label = k;
      if (key === 'status') {
        label = conf.LIGHT_MAPPING[k].text;
      }

      if (key === 'year') {
        label = k + '年';
      }
      obj.label = label;
      obj.count = o[k];
      obj.value = k;
      return obj;
    });
  }

  getData(fn) {
    if (!this.state.loading) {

      this.setState({loading: true});
      axios.get('/api/getProjectsByType', {params: { type: this.props.match.params.filter }})
        .then((res) => {

          // res = JSON.parse('{"data":{"header":[{"title":"项目名称","key":"name"},{"title":"年份","key":"year"},{"title":"是否关注项目","key":"isAttention"},{"title":"经度","key":"long"},{"title":"纬度","key":"lat"},{"title":"状态","key":"status"}],"rows":[{"name":"湿地公园1期","lat":39.5051985819905,"long":116.00620384386006,"id":1,"year":2014,"isAttention":true,"status":4,"batch":"第3批"},{"name":"湿地公园2期","lat":39.79525671242577,"long":116.7642149365932,"id":2,"year":2013,"isAttention":false,"status":1,"batch":"第4批"},{"name":"湿地公园3期","lat":39.185605626116654,"long":116.78426245155293,"id":3,"year":2014,"isAttention":true,"status":4,"batch":"第1批"},{"name":"湿地公园4期","lat":39.553465066272096,"long":116.0015054361252,"id":4,"year":2011,"isAttention":false,"status":3,"batch":"第3批"},{"name":"湿地公园5期","lat":39.62515581851251,"long":116.34739801088796,"id":5,"year":2012,"isAttention":true,"status":4,"batch":"第3批"},{"name":"湿地公园6期","lat":39.958120170669844,"long":116.80609294878944,"id":6,"year":2012,"isAttention":true,"status":3,"batch":"第5批"},{"name":"湿地公园7期","lat":39.760567841548756,"long":116.9526772253388,"id":7,"year":2015,"isAttention":true,"status":1,"batch":"第3批"},{"name":"湿地公园8期","lat":39.16047071829436,"long":116.6141686416381,"id":8,"year":2011,"isAttention":true,"status":2,"batch":"第5批"},{"name":"湿地公园9期","lat":39.62404799354974,"long":116.28808633645072,"id":9,"year":2013,"isAttention":false,"status":3,"batch":"第3批"},{"name":"湿地公园10期","lat":39.67532300257604,"long":116.18947177182946,"id":10,"year":2016,"isAttention":true,"status":1,"batch":"第2批"},{"name":"湿地公园11期","lat":39.45034283348394,"long":116.78156048516878,"id":11,"year":2016,"isAttention":true,"status":4,"batch":"第5批"},{"name":"湿地公园12期","lat":39.868588599876524,"long":116.87732517562497,"id":12,"year":2016,"isAttention":true,"status":4,"batch":"第5批"},{"name":"湿地公园13期","lat":39.6616792553373,"long":116.63343580931611,"id":13,"year":2012,"isAttention":true,"status":0,"batch":"第2批"},{"name":"湿地公园14期","lat":39.28614615856145,"long":116.51844297116587,"id":14,"year":2015,"isAttention":true,"status":0,"batch":"第3批"},{"name":"湿地公园15期","lat":39.69643113384955,"long":116.5075892600012,"id":15,"year":2016,"isAttention":true,"status":4,"batch":"第5批"},{"name":"湿地公园16期","lat":39.22669653162949,"long":116.74004866533431,"id":16,"year":2013,"isAttention":false,"status":1,"batch":"第1批"},{"name":"湿地公园17期","lat":39.26456147556382,"long":116.44422891205981,"id":17,"year":2012,"isAttention":true,"status":1,"batch":"第5批"},{"name":"湿地公园18期","lat":39.75786581110801,"long":116.63240632518553,"id":18,"year":2015,"isAttention":true,"status":2,"batch":"第5批"}]},"pass":true}');

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
              return common.lightIcon(text);
            };
          });

          header.filter(item => /long|lat/.test(item.key)).forEach((item) => {
            item.render = (text) => {
              return text.toFixed(4);
            };
          });

          res.data.rows.filter(item => !item.key).map((item) => item.key = item.id);

          result = res.data;

          cacheRows = result.rows;

          const type = this.props.match.params.filter;
          let filter = conf.URL_FILETER_MAPPING[type].map((key) => {
            const items = this.getCountByKey(result.rows, key);
            items.unshift({
              label: '全部',
              count: cacheRows.length,
              value: ''
            });

            return {
              selected: '',
              items: items,
              key: key
            };
          });

          this.setState({
            projects: {
              header: header,
              rows: cacheRows
            },
            filter: filter,
            loading: false
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

  select(o, selectd) {
    let pass = false;
    let arr = cacheRows.map((item) => item);
    o.selected = selectd;

    this.state.filter.forEach((item) => {
      if (item.key === o.key) {
        pass = true;
      } else if (pass) {
        item.selected = '';
      }

      item.items.forEach((obj) => {
        obj.count = arr.filter((i) => { 
          return obj.value === '' || String(i[item.key]) === String(obj.value);
        }).length;
      });

      arr = arr.filter((obj) => {
        return item.selected === '' || String(obj[item.key]) === String(item.selected);
      });
    });

    this.setState({
      projects: {
        header: result.header,
        rows: arr
      }
    });
  }
  
  listItem(o) {
    return o.items.map((item, i) => {
      if (o.key === 'status' && item.value !== '') {
        return (
          <span className="light-btn" onClick={() => this.select(o, item.value)} key={`${o.key}_${i}`} type={String(item.value) === String(o.selected) ? 'primary' : ''}>
            <img title={`${item.label}`} alt={`${item.label}`} src={common.getIcon(item.value)} /> {item.count}
          </span>
        );
      } else {
        return (
          <Button key={`${o.key}_${i}`} size="large" onClick={() => this.select(o, item.value)} type={o.selected === item.value ? 'primary' : ''}>{ `${item.label}(${item.count})` }</Button>
        );
      }
    });
  }

  getHeader() {
    return this.state.filter.map((item) => {
      if (item.key === 'status') {
        return (
          <div className="light-btn-group" style={{ marginRight: '10px' }} key={item.key}>
            { this.listItem(item) }
          </div>
        );
      } else {
        return (
          <ButtonGroup key={item.key} style={{ marginRight: '10px' }}>
            { this.listItem(item) }
          </ButtonGroup>
        );
      }
    });
  }

  openDetail(id) {

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
