import React, { Component } from 'react';
import { Table } from 'antd';

// import {
//   Link
// } from 'react-router-dom';

class PTable extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    // console.log(this.props);
  }

  render() {
    return (
      <div>
        <Table dataSource={this.props.projects.rows} columns={this.props.projects.header} />
      </div>
    );
  }
}

export default PTable;
