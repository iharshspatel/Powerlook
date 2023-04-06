import React, { Component } from 'react';
import {utcToLocal} from '../../utilities';

class OrderComments extends Component {

  render() {
    const {comments, comment_header} = this.props;

    return (
        <div className="status-track-content">
          <h6>{comment_header}</h6>
          <ul>
          {
            comments.map((comment, index) => {
              return <li key={index}>{typeof comment.created_at !== 'undefined' && <span className="created_at">{utcToLocal(comment.created_at, 'MMMM Do YYYY, h:mm a')}</span>}<span style={typeof comment.color !== 'undefined' ? {color: comment.color} : {}}>{comment.comment}</span></li>
            })
          }
          </ul>
        </div>
    );
  }
}

export default OrderComments;
