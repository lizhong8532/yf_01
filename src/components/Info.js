import React, { Component } from 'react';
import { Row, Col } from 'antd';
import './Info.css';

const d = 24;

class Info extends Component {
  createGrid() {
    return this.props.grid.map((item, i) => {
      if (item.length >= 2) {
        return <Row gutter={16} key={i} className="lz-row">
          <Col className="lz-label" span={d / item.length / 2}>
            <div className="gutter-box">{ item[0].label }</div>
          </Col>
          <Col className="gutter-row" span={d / item.length / 2}>
            <div className="lz-value">{ item[0].value }</div>
          </Col>
          <Col className="lz-label" span={d / item.length / 2}>
            <div className="gutter-box">{ item[1].label }</div>
          </Col>
          <Col className="gutter-row" span={d / item.length / 2}>
            <div className="lz-value">{ item[1].value }</div>
          </Col>
        </Row>
      } else {
        return <Row gutter={16} key={i} className="lz-row">
          <Col className="lz-label" span={d / 4}>
            <div className="gutter-box">{ item[0].label }</div>
          </Col>
          <Col className="gutter-row" span={d / 4 * 3}>
            <div className="lz-value">{ item[0].value }</div>
          </Col>
        </Row>
      }
    });
  }

  render() {
    return (
      <div>
        { this.createGrid() }
      </div>
    );
  }
}

export default Info;
