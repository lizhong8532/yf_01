import React, { Component } from 'react';
import { Layout } from 'antd';

import './Home.css';
import Sidebar from './Sidebar';
import Project from './Project';
import Analysis from './Analysis';
import Detail from './Detail';
import Attachment from './Attachment';
import conf from '../config';

import {
  Route,
  Switch
} from 'react-router-dom';


const { Header, Sider, Content } = Layout;


class Home extends Component {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    collapsed: false,
    mode: 'inline',
    route: { label: '' }
  };

  onCollapse(collapsed) {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }

  updateBreadcrumb(item) {
    this.setState({
      route: item
    });
  }

  render() {
    let headerStyle = {
      height: conf.HEADER_HEIGHT,
      lineHeight: conf.HEADER_HEIGHT
    };

    // 
    return (
      <Layout>
        <Header style={ headerStyle }>
          <img className="lz-top-left" alt="left" src="/images/topleft.png" />
          <img className="lz-top-right" alt="right" src="/images/topright.png" />
          <img className="lz-logo" alt="logo" src="/images/toplogo.png" />
        </Header>
        <Layout className="lz-content" style={{ height: window.innerHeight - conf.HEADER_HEIGHT }}>
          <Sider
            className="lz-sider"
            collapsible
            style={{ background: '#ececec' }}
            collapsed={this.state.collapsed}
            onCollapse={(collapsed) => this.onCollapse(collapsed)}
          >
            <Sidebar items={conf.SIDEBAR}/>
          </Sider>
          <Layout style={{ padding: '10px 24px 24px',  background: '#fff', overflow: 'hidden' }}>
            <Content>
              <div>
                <Switch>
                  <Route path="/home/project/list/:model/:filter" component={Project}/>
                  <Route path="/home/project/analysis" component={Analysis}/>
                  <Route path="/home/project/detail/:id" component={Detail}/>
                  <Route path="/home/attachment" component={Attachment}/>
                </Switch>
              </div>

            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default Home;
