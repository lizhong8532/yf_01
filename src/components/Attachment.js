import React, { Component } from 'react';
import { Button, Icon, Upload, message } from 'antd';
import conf from '../config';

class PTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ''
    };
  }
  componentDidMount() {

  }
  refreshIframe() {
    this.refs.iframe.contentWindow.location.reload(true);
  }

  change(info) {

    if(info.file.response) {
      if (info.file.response.message) {
        message.error(info.file.response.message);
      }
      if (info.file.response) {
        message.info(info.file.response.url);
        this.refreshIframe();
      }
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', height: window.innerHeight - conf.HEADER_HEIGHT - 75 }}>
        <div style={{ flex: 1, height: '100%', background: '#F5F5F5', display: 'flex', justifyContent: 'center' }}>
          <Upload name="uploadfile" action="/api/upload" onChange={ (info) => this.change(info) }>
            <Button style={{ marginTop: '10em' }}>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
          <div>{ this.state.data }</div>
        </div>
        <div style={{ flex: 1, height: '100%' }}>
          <div style={{ textAlign: 'right', marginBottom: "10px" }}>
            <Button icon="refresh" onClick={ () => this.refreshIframe() }>刷新</Button>
          </div>
          <iframe ref="iframe" src="/fileslist/" title="files" frameBorder="0" style={{ width: "100%", height: "calc(100% - 20px)", border: 0  }} />
        </div>
      </div>
    );
  }
}

export default PTable;
