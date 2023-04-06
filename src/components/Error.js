import React, { Component } from 'react';

export default class Error extends Component {
  render() {
      return (
        <span className="error-text">
          {this.props.text}
        </span>
      );
    }
}