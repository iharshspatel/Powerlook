/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { ToastsStore } from 'react-toasts';
import { updatePassword } from '../../actions/customer';
import Error from '../Error';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: null
    };
  }

  update() {
    let errors = {};
    const { currentPassword, newPassword, confirmPassword } = this.refs;
    if (currentPassword.value === '')
      errors = { ...errors, currentPassword: 'Please enter your current password' };
    if (newPassword.value === '')
      errors = { ...errors, newPassword: 'Please enter new password' };
    else if (confirmPassword.value === '')
      errors = { ...errors, confirmPassword: 'Please enter confirm password' };
    else if (confirmPassword.value !== newPassword.value)
      errors = { ...errors, confirmPassword: 'Password mismatches' };

    if (Object.keys(errors).length > 0) {
      this.setState({
        errors
      });
    } else {
      updatePassword({ currentPassword: currentPassword.value, newPassword: newPassword.value }).then(response => {
        ToastsStore.success('Your password has been updated successfully.');
      });
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="sections-edit-profile">
        <h4>Change Password</h4>
        <div className="edit-fields">
          <div className="form-fields-block">
            <fieldset>
              <label>Current Password</label>
              <div className="text-field-container">
                <input ref="currentPassword" type="password" className="text-field" placeholder="Enter current password" />
                {errors && typeof errors.currentPassword !== 'undefined' && <Error text={errors.currentPassword} />}
              </div>
            </fieldset>
            <fieldset>
              <label>New Password</label>
              <div className="text-field-container">
                <input ref="newPassword" type="password" className="text-field" placeholder="Enter new password" />
                {errors && typeof errors.newPassword !== 'undefined' && <Error text={errors.newPassword} />}
              </div>
            </fieldset>
            <fieldset>
              <label>Confirm New Password</label>
              <div className="text-field-container">
                <input ref="confirmPassword" type="password" className="text-field" placeholder="Retype new password" />
                {errors && typeof errors.confirmPassword !== 'undefined' && <Error text={errors.confirmPassword} />}
              </div>
            </fieldset>
          </div>
          <div className="btn-block-form">
            {/* <a href="javascript:void(0);" className="btn-border-secondary large-btn vam">Cancel</a> */}
            <a href="javascript:void(0);" className="btn-fil-primary large-btn vam" onClick={this.update.bind(this)}>Save</a>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePassword;
