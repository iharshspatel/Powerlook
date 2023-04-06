import React, { Component } from 'react';
import Modal from '../Modal';
import ReviewRatingForm from './ReviewRatingForm';

export default class ReviewRatingModal extends Component {

  render() {

    return (
        <Modal 
          id="login-modal"
          show={true}
          onHide={this.props.onHide}
            header={<h4>Write a Review</h4>}
            body={<ReviewRatingForm onHide={this.props.onHide} />}
        />
    );
  }
}