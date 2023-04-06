import React, { Component } from 'react';
import {clearSession} from '../utilities';

class Logout extends Component {

  componentWillMount(){
    clearSession('/');
  }

  render() {
    return null;
  }
}

export default Logout;
