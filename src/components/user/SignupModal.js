import React, { Component } from 'react';
import Modal from '../Modal';
import SignupForm from './SignupForm';
import LoginModal from './LoginModal';

export default class SignupModal extends Component {

  showModal() {
    window.getFooter().setState({
      renderElement: <LoginModal onHide={this.hideModal.bind(this)} />
    });
  }

  hideModal() {
    window.getFooter().setState({
      renderElement: null
    });
  }

  render() {

    return (
      <Modal
        id="login-modal"
        show={true}
        onHide={this.props.onHide}
        bodyClass="slide-container"
        header={<><label>Welcome to Powerlook!</label><h4>Let’s get started</h4></>}
        body={<SignupForm />}
        footer={<p>Already have an account? <a href="javascript:void(0);" onClick={this.showModal.bind(this)}>Sign IN</a></p>}
      />
    );
  }
}