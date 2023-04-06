import React, { Component } from 'react';
import Modal from '../Modal';
import LoginForm from './LoginForm';
import SignupModal from './SignupModal';

export default class LoginModal extends Component {

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
          id="login-modal"
          show={true}
          onHide={this.props.onHide}
            header={<><label>Welcome Back!</label><h4>Login to your account</h4></>}
            body={<LoginForm redirectTo={this.props.redirectTo} redirectUrl={this.props.redirectUrl} />}
            footer={<p>Don’t have an account?<a href="javascript:void(0);" onClick={this.showModal.bind(this)}>Sign up Now</a></p>}
        />
    );
  }
}