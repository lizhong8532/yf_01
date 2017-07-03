import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Login from './components/Login';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';
import { notification } from 'antd';
import conf from './config';
import Detail from './components/Detail';
import Analysis from './components/Analysis';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'

import 'antd/dist/antd.css';
import './index.css';

window.localStorage.setItem('CONF_ACCESS_TOKEN', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImFjY291bnRObyI6ImFkbWluIiwibmFtZSI6Iuezu-e7n-euoeeQhuWRmCIsInRlbmFudElkIjoiZWdmYmFuayJ9.URWHQbPq7DebgANGTwr5Jf-tWEWVDjpe6DPg3klD6Nc');

if (!window.localStorage.getItem('CONF_ACCESS_TOKEN')) {
  window.location.href = '/xmdb';
}

axios.defaults.headers.common['access-token'] = 'Bearer ' + window.localStorage.getItem('CONF_ACCESS_TOKEN');
// axios.interceptors.request.use((config) => {
//   if (window.location.port === '3000') {
//     config.url += '.json';
//   }
//   return config;
// });

axios.interceptors.response.use((response) => {
  // Do something with response data

  // Check is an Object
  let title = '请求异常';
  let msg = '服务器数据异常，请稍后重新尝试请求';

  // if (!(response.data instanceof Object)) {
  //   notification.error({
  //     message: title,
  //     description: msg
  //   });
  if (response.data instanceof Object && typeof response.data.pass === 'boolean' && !response.data.pass) {
    notification.error({
      message: title,
      description: response.data.um ? response.data.um : msg
    });
  }

  return response.data;
}, (error) => {
  // Do something with response error

  let response = error.response;
  let msg = '服务器数据异常，请稍后重新尝试请求';

  notification.error({
    message: '请求异常',
    description: response.data instanceof Object && response.data.um ? response.data.um : msg
  });

  return Promise.reject(error);
});

let defaultUrl = '/';
conf.SIDEBAR.forEach((item) => {
  if (item.default) {
    defaultUrl = item.url;
  }
});

const Routers = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/home" component={Home}/>
        <Route path="/detail/:id" component={Detail}/>
        <Route path="/charts" component={Analysis}/>
        <Route path="/login" component={Login}/>
        <Redirect from="/" to={ defaultUrl } />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(<Routers />, document.querySelector('#root'));
registerServiceWorker();
