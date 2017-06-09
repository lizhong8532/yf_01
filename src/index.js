import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Login from './components/Login';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';
import { notification } from 'antd';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'

import 'antd/dist/antd.css';
import './index.css';

axios.defaults.headers.common['Authorization'] = 'test';
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

  if (!(response.data instanceof Object)) {
    notification.error({
      message: title,
      description: msg
    });
  } else if (!response.data.pass) {
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

const Routers = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/home" component={Home}/>
        <Route path="/login" component={Login}/>
        <Redirect from="/" to="/home/project/list/map/all" />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(<Routers />, document.querySelector('#root'));
registerServiceWorker();
