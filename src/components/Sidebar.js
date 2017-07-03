import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import e from '../event';
import conf from '../config';

import {
  Link
} from 'react-router-dom';

import { Menu, Icon } from 'antd';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: [],
      list: []
    };
  }

  handleClick(item) {
    PubSub.publish(e.SIDEBAR_CLICK, item);
  }

  listItems() {
    return this.props.items.map((item) =>
      <Menu.Item key={item.id}>
        <Link to={item.url} onClick={ () => this.handleClick(item) }>
          <span>
            <Icon type={item.icon} />
            <span className="nav-text" style={{fontSize: '1.2em'}}>{item.label}</span>
          </span>
        </Link>
      </Menu.Item>
    );
  }

  render() {
    let keys = [];

    if (this.props.items.length) {
      let pathName = window.location.pathname;

      this.props.items.forEach((item) => {
        if (item.url === decodeURIComponent(pathName)) {
          keys.push(item.id);
        }
      });

      if (!keys.length) {
        keys = conf.SIDEBAR.filter((item) => item.default).map((item) => item.id);
      }

      return (
        <Menu defaultSelectedKeys={[keys[0]]} style={{ background: '#ececec' }} className="Sidebar-Menu">
          { this.listItems() }
        </Menu>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}

export default Sidebar;
