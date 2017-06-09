import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import './Home.css';

class Login extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Login</h2>
        </div>
        <p><Link to="/">Home</Link></p>
      </div>
    );
  }
}

export default Login;
