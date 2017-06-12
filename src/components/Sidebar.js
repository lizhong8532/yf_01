import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import e from '../event';

import {
  Link
} from 'react-router-dom';

import { Menu, Icon } from 'antd';

class Sidebar extends Component {

  state = {
    keys: []
  };

  handleClick(item) {
    PubSub.publish(e.SIDEBAR_CLICK, item);
  }

  listItems() {
    return this.props.items.map((item) =>
      <Menu.Item key={item.url}>
        <Link to={item.url} onClick={ () => this.handleClick(item) }>
          <span>
            <Icon type={item.icon} />
            <span className="nav-text">{item.label}</span>
          </span>
        </Link>
      </Menu.Item>
    );
  }

  render() {
    let keys = [];
    let pathName = window.location.pathname;

    if (pathName.indexOf('/home/project/list') === 0) {
      if (pathName.indexOf('attention') >= 0) {
        pathName = '/home/project/list/map/attention';
      } else if (pathName.indexOf('batch') >= 0) {
        pathName = '/home/project/list/map/batch';
      } else {
        pathName = '/home/project/list/map/all';        
      }
    }

    this.props.items.forEach((item) => {
      if (item.url === pathName) {
        keys.push(item.url);
      }
    });

    return (
      <Menu defaultSelectedKeys={keys} style={{ background: '#ececec' }} className="Sidebar-Menu">
        { this.listItems() }
      </Menu>
    );
  }
}

export default Sidebar;
