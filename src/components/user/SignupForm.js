import React, { Component } from 'react';
import { connect } from 'react-redux';
import SocialLogin from './SocialLogin';
import { ToastsStore } from 'react-toasts';
import Error from '../Error';
import { login } from '../../actions/auth';
import { trackFBEvent, trackwebEngageEvent } from '../../utilities';
import { resendSignUpOTP, signupUser, verifyOTPAndSignup } from '../../actions/customer';
import { USER_LOGGED_IN, USER_SIGNED_UP } from '../../constants'
import "./SignupForm.css"

class SignupForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobile_number: null,
      name: null,
      password: null,
      otp: null,
      errors: {},
      processing: false,
      is_tc_checked: true,
      btnText: 'Signup'
    };

    this.autoLogin = this.autoLogin.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status != this.state.status && nextProps.compName == 'auth') {
      this.hideModal();
    }
  }

  showModal() {
    // window.getFooter().setState({
    //   renderElement: <ForgotPasswordModal onHide={this.hideModal.bind(this)} />
    // });
  }

  hideModal() {
    window.getFooter().setState({
      renderElement: null
    });
  }

  autoLogin() {
    const { mobile_number, password } = this.state;

    this.props.login({ username: mobile_number, password }).then(response => {
      trackwebEngageEvent(USER_LOGGED_IN, {
        "Mode": "Mobile",
      });
      this.setState({
        processing: false
      });
      if (typeof this.props.redirectTo === 'undefined')
        return;

      const match = window.location.search.match(/redirectTo=(.*)/);
      if (match && match.length >= 2 && match[1] != '') {
        this.props.redirectTo(match[1]);
      }
    });
  }

  /**
   * Submit login form
   */
  submit(e) {
    e.preventDefault();
    const { processing, mobile_number, otp, password } = this.state;
    if (processing === true) {
      return false;
    }
    this.setState({
      processing: true
    });
    let IsSignupOpt = 1
    if(this.state.is_tc_checked == true){      
      IsSignupOpt = 2
    }      

    let IsReferrerUrl = localStorage.getItem("websiteReferrer");
    
    verifyOTPAndSignup({ mobile_number, otp, password, IsSignupOpt, IsReferrerUrl }).then(response => {
      this.setState({
        btnText: 'Signing in...',
        errors: []
      });
      trackwebEngageEvent(USER_SIGNED_UP, {
        mode: "Mobile",
      });
      
      if(this.state.is_tc_checked){
        window.webengage.user.setAttribute('we_whatsapp_opt_in', true);
      }
      //trackFBEvent('CompleteRegistration', {});

      this.autoLogin();
    }).catch(error => {
      this.setState({
        processing: false,
        errors: typeof error.response.data[0] !== 'undefined' ? error.response.data[0] : []
      });
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  resendOTP(e) {
    e.preventDefault();
    const { processing, mobile_number } = this.state;
    resendSignUpOTP({ mobile_number }).then(response => {
      ToastsStore.success('New OTP has been sent.');
    }).catch(error => {
      this.setState({
        errors: typeof error.response.data[0] !== 'undefined' ? error.response.data[0] : []
      });
    });
  }

  signUpUser(e) {
    e.preventDefault();
    const { processing, name, mobile_number } = this.state;       
    
    if (processing === true) {
      return false;
    }
    this.setState({
      processing: true
    });
    signupUser({ name, mobile_number }).then(response => {

      this.setState({
        processing: false,
        errors: []
      });
      this.slideContainer();
    }).catch(error => {
      this.setState({
        processing: false,
        errors: typeof error.response.data[0] !== 'undefined' ? error.response.data[0] : []
      });
    });
  }

  slideContainer() {
    window.$$('#signup-form').parents('.slide-container').toggleClass('step-2-active');
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

    const { errors, processing, name, mobile_number, password, is_tc_checked, otp, btnText } = this.state;

    return (
      <form id="signup-form" onChange={this.handleChange.bind(this)} onSubmit={this.submit.bind(this)}>
        <div className="step-1 slide-step-form">
          <div className="form-fields-block">
            <fieldset>
              <label>Name</label>
              <div className="text-field-container">
                <input value={name} autofocus="true" name="name" type="text" className="text-field" placeholder="Enter your name" />
                {typeof errors.name !== 'undefined' && <Error text={errors.name} />}
              </div>
            </fieldset>
            <fieldset>
              <label>Mobile Number</label>
              <div className="text-field-container mobile-no">
                <div className="static-value">+91</div>
                <input value={mobile_number} name="mobile_number" type="text" className="text-field" placeholder="Enter mobile number" />
                {typeof errors.mobile_number !== 'undefined' && <Error text={errors.mobile_number} />}
              </div>
            </fieldset>
            <label>
              <input value='false' checked={is_tc_checked} type="checkbox" style={checkboxStyle} onChange={this.termsandconditionsChange} name="term_condition" />
              <span className="filter-input" style={checkBoxLblStyle}>Get the latest updates and offers on WhatsApp.</span>
              {typeof errors.is_tc_checked !== 'undefined' && <Error text={errors.is_tc_checked} />}
            </label>
            <div className="btn-block-modal">
              <a href="javascript:void(0);" className={`btn-fil-primary loading go-step-2 ${processing === true ? "show" : ""}`} onClick={this.signUpUser.bind(this)}>Continue</a>
            </div>
          </div>
          {/* <div className="divider-ui"><span>Or</span></div>
                  <div className="otherlogin">
                      <SocialLogin />
                  </div> */}
        </div>
        <div className="step-2 slide-step-form">
          <div className="form-fields-block">
            <fieldset>
              <label>Mobile Number</label>
              <div class="text-field-container no-field-signup">
                <div class="country-code">+91</div>
                <input type="text" name="mobile_number" class="text-field" placeholder="Enter mobile number" value={mobile_number} />
                <a href="javascript: void(0);" class="hyperlink-field change-no" onClick={this.slideContainer}>Change?</a>
              </div>
            </fieldset>
            <div className="otp-resend">
              <span>OTP sent to your mobile number </span>
              <a href="javascript:void(0);" className="hyperlink-field" onClick={this.resendOTP.bind(this)}>Resend?</a>
            </div>
            <fieldset>
              <label>Enter OTP</label>
              <div className="text-field-container">
                <input value={otp} name="otp" type="text" className="text-field" placeholder="Enter OTP" />
                {typeof errors.otp !== 'undefined' && <Error text={errors.otp} />}
              </div>
            </fieldset>
            <fieldset>
              <label>Set Password</label>
              <div className="text-field-container">
                <input value={password} name="password" type="password" className="text-field" placeholder="Enter Password" />
                {typeof errors.password !== 'undefined' && <Error text={errors.password} />}
              </div>
            </fieldset>
            <div className="btn-block-modal">
              <input type="submit" className={`btn-fil-primary loading ${processing === true ? "show" : ""}`} value={btnText} />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    status: state.Auth.status,
    compName: state.Auth.compName
  }
}

export default connect(mapStatesToProps, { login })(SignupForm);