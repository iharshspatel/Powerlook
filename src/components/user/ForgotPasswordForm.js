import React, { Component } from 'react';
import {ToastsStore} from 'react-toasts';
import Error from '../Error';
import LoginModal from './LoginModal';
import {verifyUsernameExists, verifyOTPAndResetPassword} from '../../actions/customer';

class ForgotPasswordForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            otp: '',
            password: '',
            confirm_password: '',
            username: props.username,
            errors: {},
            processing: false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * Submit login form
     */
    submit(e){
        e.preventDefault();
        if(this.state.processing === true)
          return;

        const {username, confirm_password, password, otp} = this.state;
        let errors = {};

        if(password.replace(/\s/, '') == ''){
          errors = {...errors, password: 'Please enter new password'};
        }
        if(confirm_password.replace(/\s/, '') == ''){
          errors = {...errors, confirm_password: 'Please enter confirm new password'};
        }
        if(otp.replace(/\s/, '') == ''){
          errors = {...errors, otp: 'Please enter OTP'};
        }
        if(password.replace(/\s/, '') != '' && confirm_password.replace(/\s/, '') != '' && password !== confirm_password){
          errors = {...errors, confirm_password: 'Confirm password mismatch'};
        }

        if(Object.keys(errors).length > 0){
          this.setState({
            errors
          });
          return;
        }

        this.setState({
          processing: true
        });
        verifyOTPAndResetPassword({username, password, otp}).then(response => {
          ToastsStore.success(response.data);
          window.getFooter().setState({
            renderElement: <LoginModal onHide={this.hideModal.bind(this)} />
          });
        }).catch(error => {
          this.setState({
            errors: typeof error.response.data[0] !== 'undefined' ? error.response.data[0] : [],
            processing: false
          });
        });
    }

    hideModal(){
        window.getFooter().setState({
            renderElement: null
        });
    }

    handleChange(e){
        const {name, value} = e.target;
        this.setState({
            [name]: value
        });
    }

    resendOTP(e){
      e.preventDefault();
      const {username} = this.state;
      verifyUsernameExists(username).then(response => {
        ToastsStore.success('New OTP has been sent.');
      }).catch(error => {
        this.setState({
          errors: typeof error.response.data[0] !== 'undefined' ? error.response.data[0] : []
        });
      });
    }

    render() {
        const {errors, processing} = this.state;

        return (
            <>
              <div className="form-fields-block">
                <form onChange={this.handleChange} onSubmit={this.submit.bind(this)}>
                  <fieldset className={typeof errors.otp !== 'undefined' ? 'error' : ''}>
                      <label>Enter OTP just sent on your Mobile / Email Id</label>
                      <div className="text-field-container">
                          <input autoComplete="new-password" ref="otp" autofocus="true" required name="otp" type="text" className="text-field" placeholder="Enter OTP" />
                            {typeof errors.otp !== 'undefined' && <Error text={errors.otp} />}
                      </div>
                  </fieldset>
                  <fieldset className={typeof errors.password !== 'undefined' ? 'error' : ''}>
                      <label>SET NEW PASSWORD</label>
                      <div className="text-field-container sm-right-field-link">
                          <input autoComplete="new-password" required type="password" name="password" className="text-field" placeholder="Enter Password" />
                          {typeof errors.password !== 'undefined' && <Error text={errors.password} />}
                      </div>
                  </fieldset>
                  <fieldset className={typeof errors.confirm_password !== 'undefined' ? 'error' : ''}>
                      <label>CONFIRM NEW PASSWORD</label>
                      <div className="text-field-container sm-right-field-link">
                          <input autoComplete="new-password" required type="password" name="confirm_password" className="text-field" placeholder="Enter Password" />
                          {typeof errors.confirm_password !== 'undefined' && <Error text={errors.confirm_password} />}
                      </div>
                  </fieldset>
                  <div className="otp-resend">
                    <span>OTP sent to your mobile number / Email Id </span>
                    <a href="javascript:void(0);"  onClick={this.resendOTP.bind(this)} className="hyperlink-field">Resend?</a>
                  </div>
                  <div className="btn-block-modal">
                      <input type="submit" className={`btn-fil-primary load ${processing === true ? "show" : ""}`} value="Reset Password" />
                  </div>
                </form>
              </div>
            </>
        );
    }
}

export default ForgotPasswordForm;