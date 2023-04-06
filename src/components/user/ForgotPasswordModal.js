import React, { Component } from 'react';
import Modal from '../Modal';
import ForgotPasswordForm from './ForgotPasswordForm';
import SignupModal from './SignupModal';

export default class ForgotPasswordModal extends Component {

  showModal(){
      window.getFooter().setState({
        renderElement: <SignupModal onHide={this.hideModal.bind(this)} />
      });
  }

  hideModal(){
      window.getFooter().setState({
          renderElement: null
      });
  }

  render() {

    return (
        <Modal 
          id="forgot-password-modal"
          show={true}
          onHide={this.props.onHide}
            header={<><label>Login to your account</label><h4>Recover Password</h4></>}
            body={<ForgotPasswordForm username={this.props.username} />}
            footer={<p>Don’t have an account?<a href="javascript:void(0);" onClick={this.showModal.bind(this)}>Sign up Now</a></p>}
        />
    );
  }
}