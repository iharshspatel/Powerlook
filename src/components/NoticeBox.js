import React, { Component } from 'react';

export default class NoticeBox extends Component {
  render() {
    return (
      window.noticeText !== "" ?
        <div className="alertBlock">
          <span className="icon icon-info-border"></span>
          <div className="content-overflow">
            {/*<h6>Your order could be delayed due to COVID-19.</h6>*/}
            <p>{window.noticeText}</p>
          </div>
        </div> : null
    );
  }
}