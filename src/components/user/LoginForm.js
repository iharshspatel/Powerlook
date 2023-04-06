/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../Modal';
import SignupModal from './SignupModal';
import SendResetPasswordOTP from './SendResetPasswordOTP';
import Error from '../Error';
import { login, sendOTP, verifyOTP, reSendOTP } from '../../actions/auth';

class LoginForm extends Component {
  currentRef = null
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      status: props.status,
      errors: {},
      processing: false,
      loginOTP: true,
      showResend: false,
      showCount: -1,
      is_tc_checked: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showSignupModal() {
    window.getFooter().setState({
      renderElement: <SignupModal onHide={this.hideModal} />
    });
  }

  showForgotPasswordModal() {
    window.getFooter().setState({
      renderElement: <Modal
        id="reset-password-otp-modal"
        show={true}
        onHide={this.hideModal}
        header={<><h4>Forgot Password ?</h4><p>We will send you OTP to reset your password. Enter Email Address or Phone Number</p></>}
        body={<SendResetPasswordOTP />}
        footer={<p>Don’t have an account?<a href="javascript:void(0);" onClick={this.showSignupModal.bind(this)}>Sign up Now</a></p>}
      />
    });
  }

  hideModal() {
    window.getFooter().setState({
      renderElement: null
    });
  }

  /**
   * Submit login form
   */
  submit(e) {
    e.preventDefault();
    if (this.state.errors.username)
      return;
    if (this.state.processing === true)
      return;

    const { username, password } = this.state;
    this.setState({
      processing: true
    });
    if (window.recaptcha) {
      window.recaptcha.execute();
    }
    if (this.state.loginOTP) {
      let verifyOTPParams = { username: this.state.username, otp: this.state.password }
      
      if(this.state.is_tc_checked == true){
        verifyOTPParams = {...verifyOTPParams, IsSignupOpt: 2}
      }

      this.props.verifyOTP(verifyOTPParams).then(response => {
        if(this.state.is_tc_checked){
          window.webengage.user.setAttribute('we_whatsapp_opt_in', true);
        }
        this.loginSuccess(response)
      });
    } else {
      this.props.login({ username, password }).then(response => {
        this.loginSuccess(response)

      });
    }

    // Verify login credentials and login on success
    //this.props.verify({phone, password});
  }

  loginSuccess(response) {
    this.setState({
      processing: false
    });

    if (typeof this.props.redirectTo === 'undefined')
      return;

    if (typeof this.props.redirectUrl !== 'undefined') {
      this.props.redirectTo(this.props.redirectUrl);
      return;
    }

    // if(!response.data.token){
    //   return;
    // }
    const match = window.location.search.match(/redirectTo=(.*)/);
    if (match && match.length >= 2 && match[1] !== '' && match[1].match(/\/login/) === null) {
      this.props.redirectTo(match[1]);
    } else {
      this.props.redirectTo('/');
    }

  }

  validatePhoneNumber(input_str) {
    var re = /^[0-9]{10}$/;
    return re.test(input_str);
  }

  handleChange(e) {
    const { name, value } = e.target;
    const isValid = this.validatePhoneNumber(value)
    if (name === 'username' && !isValid) {
      this.setState({
        errors: {
          username: "Please enter valid mobile number"
        }
      })
      return
    } else if (name === 'username' && isValid) {
      this.setState({
        errors: {}
      })
      this.setState({
        [name]: value
      });
    } else {
      this.setState({
        [name]: value
      });
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status !== this.state.status && nextProps.compName === 'auth') {
      this.hideModal();
    }
  }

  sendOtp() {
    this.props.sendOTP(this.state.username);
    this.setTimer();
  }

  setTimer() {
    this.setState({
      showCount: 10
    });
    const _timer = setInterval(() => {
      if (this.state.showCount <= 0) {
        clearInterval(_timer);
        this.setState({
          showResend: true,
          showCount: 10
        });
      } else {
        this.setState({
          showCount: this.state.showCount - 1
        });
      }
    }, 1000);
  }

  resendOTP() {
    this.setState({
      showResend: false
    })
    this.props.reSendOTP(this.state.username);
    this.setTimer()
  }

  termsandconditionsChange = () => {
    this.setState({
      is_tc_checked: !this.state.is_tc_checked,
      errors: []
    });
  }

  render() {
    const checkboxStyle = {
      marginRight: '5px',
      accentColor: "#bd0f21",
      top: '2px',
      position : 'relative'
    }

    const checkBoxLblStyle ={
      opacity: 0.8,
      color: '#33373e',
      fontSize: '14px',
      margin: '0px'
    }

    const { errors, processing, is_tc_checked } = this.state;
    return (
      <>
        <div className="form-fields-block">
          <form onChange={this.handleChange} onSubmit={this.submit.bind(this)}>
            {/* <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation" onClick={() => this.setState({ loginOTP: true, username: '', showResend: false, showCount: -1 })}>
                <button className={"nav-link " + (this.state.loginOTP ? "active" : "")} id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected={this.state.loginOTP === true ? "true" : "false"}>
                  Login Via OTP
                </button>
              </li>
              <li className="nav-item" role="presentation" onClick={() => this.setState({ loginOTP: false, username: '', showResend: false, showCount: -1 })}>
                <button className={"nav-link " + (!this.state.loginOTP ? "active" : "")} id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected={this.state.loginOTP === true ? "false" : "true"}>
                  Login Via Password
                </button>
              </li>
            </ul> */}
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                {
                  this.state.loginOTP ?
                    <>
                      <fieldset className={(typeof errors.username !== 'undefined') ? 'error' : ''}>
                        <label>Mobile number</label>
                        <div className="text-field-container with-otp no-field-signup">
                          <div class="country-code">+91</div>
                          <input ref="username" autoFocus={true} required name="username" type="tel" className="text-field" placeholder="Enter your mobile number" />
                          {typeof errors.username !== 'undefined' && <Error text={errors.username} />}
                          {
                            this.state.username.length >= 5 && !this.state.showResend && this.state.showCount === -1 ?
                              <button type='button' onClick={() => this.sendOtp()}>Get OTP</button> : null
                          }
                          {
                            this.state.showCount > -1 && !this.state.showResend ?
                              <button> {this.state.showCount}</button> : null
                          }
                          {
                            this.state.showResend ?
                              <button type='button' onClick={() => this.resendOTP()}>Resend OTP</button> : null
                          }
                        </div>
                      </fieldset>
                      <fieldset className={typeof errors.password !== 'undefined' ? 'error' : ''}>
                        <label>Enter OTP</label>
                        <div className="text-field-container">
                          <input ref="password" autoFocus={true} required name="password" type="text" className="text-field" placeholder="Enter OTP" />
                          {typeof errors.password !== 'undefined' && <Error text={errors.password} />}
                        </div>
                      </fieldset>
                    </> : null
                }
              </div>
              <div className="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                {
                  !this.state.loginOTP ?
                    <>
                      <fieldset className={typeof errors.username !== 'undefined' ? 'error' : ''}>
                        <label>Mobile number</label>
                        <div className="text-field-container">
                          <input ref="username" autoFocus={true} required name="username" type="tel" className="text-field" placeholder="Enter your mobile number" />
                          {typeof errors.username !== 'undefined' && <Error text={errors.username} />}
                        </div>
                      </fieldset>
                      <fieldset className={typeof errors.password !== 'undefined' ? 'error' : ''}>
                        <label>Password</label>
                        <div className="text-field-container sm-right-field-link">
                          <input required type="password" name="password" className="text-field" placeholder="Enter Password" />
                          {typeof errors.password !== 'undefined' && <Error text={errors.password} />}
                          <a href="javascript:void(0);" onClick={this.showForgotPasswordModal.bind(this)} className={`hyperlink-field`}>Forgot?</a>
                        </div>
                      </fieldset>
                    </> : null
                }
              </div>
            </div>

            <label>
              <input value='false' checked={is_tc_checked} type="checkbox" style={checkboxStyle} onChange={this.termsandconditionsChange} name="term_condition" />
              <span className="filter-input" style={checkBoxLblStyle}>Get the latest updates and offers on WhatsApp.</span>              
            </label>

            <div className="btn-block-modal">
              <input type="submit" className={`btn-fil-primary load ${processing === true ? "show" : ""}`} value="Login" />
            </div>
          </form>
        </div>
        {/* <div className="divider-ui"><span>Or</span></div>
        <div className="otherlogin">
          <SocialLogin redirectTo={redirectTo} />
        </div> */}
      </>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    status: state.Auth.status,
    compName: state.Auth.compName
  }
}

export default connect(mapStatesToProps, { login, sendOTP, verifyOTP, reSendOTP })(LoginForm);
