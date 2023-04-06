import React, { Component } from 'react';
import ForgotPasswordModal from './ForgotPasswordModal';
import Error from '../Error';
import {verifyUsernameExists} from '../../actions/customer';

class SendResetPasswordOTP extends Component {

    constructor(props){
        super(props);
        this.state = {
            errors: {},
            usernameCheckProcessing: false
        };

        this.hideModal = this.hideModal.bind(this);
    }

    submit(e){
        e.preventDefault();
        if(this.refs.username.value.replace(/\s/, '') == ''){
          this.setState({
            errors: {username: 'Please enter your registered mobile number or email id'}
          });
          return;
        }else{
          if(this.state.usernameCheckProcessing === true)
            return;

          this.setState({
            usernameCheckProcessing: true
          });
          verifyUsernameExists(this.refs.username.value).then(response => {
            window.getFooter().setState({
              renderElement: <ForgotPasswordModal username={this.refs.username.value} onHide={this.hideModal} />
            });
          }).catch(error => {
            this.setState({
              usernameCheckProcessing: false,
              errors: typeof error.response.data[0] !== 'undefined' ? error.response.data[0] : []
            });
          })
        }
        
    }

    hideModal(){
        window.getFooter().setState({
            renderElement: null
        });
    }

    render() {
        const {errors, usernameCheckProcessing} = this.state;

        return (
            <>
              <div className="form-fields-block">
                <form onSubmit={this.submit.bind(this)}>
                  <fieldset className={typeof errors.username !== 'undefined' ? 'error' : ''}>
                      <label>ENTER YOUR EMAIL / PHONE NUMBER</label>
                      <div className="text-field-container">
                          <input ref="username" autofocus="true" required name="username" type="text" className="text-field" placeholder="Enter email/mobile number" />
                            {typeof errors.username !== 'undefined' && <Error text={errors.username} />}
                      </div>
                  </fieldset>
                  <div className="btn-block-modal">
                      <input type="submit" className={`btn-fil-primary load ${usernameCheckProcessing === true ? "show" : ""}`} value="SEND OTP" />
                  </div>
                </form>
              </div>
            </>
        );
    }
}

export default SendResetPasswordOTP;