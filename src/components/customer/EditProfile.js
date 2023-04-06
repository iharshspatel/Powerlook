import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import {ToastsStore} from 'react-toasts';
import {createTextMask} from 'redux-form-input-masks';
import {saveProfileData, viewProfile} from '../../actions/customer';
import {dateFormat, setSessionItem, getSessionItem} from '../../utilities';

const required = value => typeof value !== 'undefined' && value !== null && value.replace(/\s+/, '').length > 0 ? undefined : 'This is a required field.';

const renderField = ({ input, disabled, hideError, spanClass, className, label, type, required, placeholder, meta: { touched, error, warning } }) => (
  <fieldset>
    <label>{label}</label>
    <div className="text-field-container">
       <input {...input} disabled={typeof disabled !== 'undefined' ? disabled : false} placeholder={placeholder} type={type} className={className ? className : ""} />
    </div>
    {!hideError && touched && ((error && <span className="error-text">{error}</span>) || (warning && <span className="error-text">{warning}</span>))}
  </fieldset>
);

const renderRadioField = ({ input, wrapperClassName, className, label, type, meta: { touched, error, warning } }) => (
  <div className={`custom-radio-ui ${wrapperClassName ? wrapperClassName : ''}`}>
      <label>
         <input {...input} type={type} className={className ? className : ""} />
         <span className="filter-input">{label}</span>
      </label>
   </div>
);

class EditProfile extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount(){
    if(!Object.keys(this.props.data).length){
      this.props.viewProfile();
    }
  }

  cancel(e){
    e.preventDefault();
    this.props.history.push(`/account`);
  }

  submitRequest(values){
    return saveProfileData({name: values.name, dob: values.dob, email: values.email, gender: values.gender, alternateContact: values.alternate_contact_number, phone_number: values.phone_number}).then(response => {
      const session = getSessionItem('user');
      session.email = response.data[0].email;
      session.name = response.data[0].name;
      session.mobile = response.data[0].mobile;
      setSessionItem('user', session);
      this.props.viewProfile().then(response => {
        ToastsStore.success('Your profile has been updated successfully.');
        this.props.history.push(`/account`);
      });
    }).catch(error => {
      if(typeof error.response.data[0] !== 'undefined'){
        throw new SubmissionError({...error.response.data[0]});
      }
    });
  }

  normalizeDob = (val, prevVal) => {
      // Prevent non-digit characters being entered
      if (isNaN(parseInt(val[val.length - 1], 10))) {
          return val.slice(0, -1);
      }

      // When user is deleting, this prevents immediate re-addition of '-' when it's deleted 
      if (prevVal && (prevVal.length >= val.length)) {
          return val;
      }

      // Add / at appropriate sections of the input
      if (val.length === 2 || val.length === 5) {
          val += '-';
      }

      // Prevent characters being entered after Dob is full
      if (val.length >= 10) {
          return val.slice(0, 10);
      }

      return val;
  }

  render() {
    const { handleSubmit, pristine, submitting, data } = this.props;

    const dob = createTextMask({
      pattern: '99-99-9999'
    })

    return (
        <div className="edit-profile-view">
          <div className="sections-edit-profile">
             <h4>General Information</h4>
             <div className="edit-fields">
                <form onSubmit={handleSubmit(this.submitRequest.bind(this))}>
                  <div className="form-fields-block">
                     <Field label="Full Name" placeholder="Enter name" validate={[required]} component={renderField} type="text" className="text-field" name="name" />

                     <Field disabled={data.email != '' && data.email !== null} label="Email Address" placeholder="Enter your Email" validate={[required]} component={renderField} type="email" className="text-field"  name="email" />

                     <div className="field-withmob disabled">
                      <div className="static-value">+91</div>
                      <Field disabled={data.phone_number != ''} validate={[required]} label="Phone Number" placeholder="Enter your mobile number" component={renderField} type="text" className="text-field"  name="phone_number" />
                     </div>

                     <div className="field-withmob">
                      <div className="static-value">+91</div>
                      <Field label="Alternate Phone Number" placeholder="Enter your alternate mobile number" component={renderField} type="text" className="text-field"  name="alternate_contact_number" />
                     </div>

                     <Field label="Date of birth" placeholder="dd-mm-yyyy" component={renderField} type="text" className="text-field"  name="dob" normalize={this.normalizeDob} />

                     <fieldset>
                        <label>Gender</label>
                        <div className="checkbox-fields-gender">
                            <Field label="Male" component={renderRadioField} type="radio" className="option-input" name="gender" value="1" />
                            <Field label="Female" component={renderRadioField} type="radio" className="option-input" name="gender" value="2" />
                            <Field wrapperClassName="mr-0" label="Not Specified" component={renderRadioField} type="radio" className="option-input" name="gender" value="3" />
                        </div>
                     </fieldset>
                  </div>
                  <div className="btn-block-form">
                     <button disabled={submitting} className="btn-border-secondary large-btn cancel-btn vam" onClick={this.cancel.bind(this)}>Cancel</button>
                     <button disabled={submitting} className={`btn-fil-primary large-btn saveprofile-btn vam loading ${submitting ? "show" : ""}`} type="submit">Save</button>
                  </div>
                </form>
             </div>
          </div>
       </div>
    );
  }
}

const ProfileForm = reduxForm({
  form: 'profile',
  destroyOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(EditProfile)

const mapStatesToProps = (state) => {
  const data = {...state.Customer.customer};
  let attrs = [];
  if(Object.keys(data).length){
    data.phone_number = '';
    data.alternate_contact_number = '';
    data.name = typeof data.firstname !== 'undefined' ? `${data.firstname} ${data.lastname}` : '';
    data.dob = typeof data.dob !== 'undefined' ? dateFormat(data.dob, 'DD-MM-YYYY') : '';
    data.gender = typeof data.gender !== 'undefined' ? `${data.gender}` : '';
    if(typeof data.custom_attributes !== 'undefined'){
      data.custom_attributes.map(attr => {
        data[attr.attribute_code] = attr.value;
        // return attr.attribute_code == 'phone_number';
      });
    }
   // data.phone_number = attrs.length > 0 ?  attrs[0].value : '';
  }
  return {
    initialValues: data,
    data,
    status: state.Customer.status,
    compName: state.Customer.compName
  }
}

export default connect(mapStatesToProps, {viewProfile})(ProfileForm);
