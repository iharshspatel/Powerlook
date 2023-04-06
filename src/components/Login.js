/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import LoginForm from './user/LoginForm';
import SignupModal from './user/SignupModal';
import Header from './Header';
import Footer from './Footer';

class Login extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    window.onpopstate = (event) => {
      this.props.history.push('/');
    };
  }

  componentWillUnmount() {
    window.onpopstate = (event) => {
      return null;
    };
  }

  showModal() {
    window.getFooter().setState({
      renderElement: <SignupModal onHide={this.hideModal.bind(this)} />
    });
  }

  hideModal() {
    window.getFooter().setState({
      renderElement: null
    });
  }

  render() {
    return (
      <div className="main-wrapper">
        <Header />
        <div className="loginpage">
          <div class="modal-head-block"><label>Welcome Back!</label><h4>Login to your account</h4></div>
          <LoginForm redirectTo={this.props.history.push} />
          <p>Don’t have an account?<a href="javascript:void(0);" onClick={this.showModal.bind(this)}>Sign up Now</a></p>
        </div>
        <Footer />
        {/* seoContent={meta_data} */}
      </div>
    );
  }
}

export default Login;
