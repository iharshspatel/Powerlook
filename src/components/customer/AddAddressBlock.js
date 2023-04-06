/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import RegionsDropdown from '../RegionsDropdown';
import StreetAddressBlock from './StreetAddressBlock';
import { getSessionItem } from '../../utilities';
import { fetchAddress } from '../../actions/home';

const validate = values => {
   var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
   const errors = {};
   if (typeof values.name === 'undefined' || !values.name.replace(/\s/, '').length) {
      errors.name = 'Please enter your name';
   }

   if (format.test(values.name)) {
      errors.name = 'Please enter your valid name';
   }

   if (typeof values.postcode === 'undefined' || values.postcode.replace(/\s/, '').length != 6 || isNaN(values.postcode)) {
      errors.postcode = 'Please enter a valid pincode';
   }

   if (typeof values.telephone === 'undefined' || !values.telephone || values.telephone.replace(/\s/, '').length != 10) {
      errors.telephone = 'Please enter your mobile number';
   }

   if (isNaN(values.telephone)) {
      errors.telephone = 'Please enter your valid mobile number';
   }

   if (typeof values.city === 'undefined' || !values.city.replace(/\s/, '').length) {
      errors.city = 'Please enter your city';
   }

   if (format.test(values.city)) {
      errors.city = 'Please enter your valid city';
   }

   if (typeof values.region_id === 'undefined' || !values.region_id.replace(/\s/, '').length) {
      errors.region_hidden = 'Please enter your state';
   }

   if (typeof values.street === 'undefined' || !values.street.filter(s => s && s.length > 0).length) {
      if (typeof errors.street === 'undefined') {
         errors.street = [];
      }
      errors.street[0] = 'Please enter your street';
   }

   return errors;
};

const renderField = ({ input, className, placeholder, maxLength, minLength, autofocus, type, meta: { touched, error, warning } }) => (
   <>
      <input {...input} placeholder={placeholder} maxLength={maxLength} minLength={minLength} autofocus={autofocus ? autofocus : "false"} type={type} className={className ? className : ""} />
      {touched && ((error && <span className="error-text">{error}</span>) || (warning && <span className="error-text">{warning}</span>))}
   </>
);

class AddAddressBlock extends Component {

   constructor(props) {
      super(props);
      this.state = {
         addresses: []
      }
   }

   componentWillMount() {
      const user = getSessionItem('user');
      this.props.change('telephone', typeof user.mobile !== 'undefined' && user.mobile ? user.mobile : '');
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.regions && nextProps.regions.length > 0) {
         this.setState({
            addresses: nextProps.regions
         });
      }
   }

   updateRegions(region_id, region_code, region, _regions) {
      if (region_id) {
         this.props.change('region_id', region_id);
      }
      if (region_code) {
         this.props.change('region_code', region_code);
      }
      if (region) {
         this.props.change('region', region);
      }
   }

   async onChangePostalCode(e) {
      if (e.target.value.length === 6) {
         try {
            const response = await fetchAddress(e.target.value)
            const data = await response.json()
            if (data[0] && data[0].PostOffice) {
               const { region_id } = this.state.addresses.find((address) => address.name === data[0].PostOffice[0].State);
               this.props.change('region_id', region_id)
               this.props.change('region', data[0].PostOffice[0].State)
               this.props.change('city', data[0].PostOffice[0].Region)
               this.props.change('selectValues', region_id)
               window.$$("#region_id").val(region_id).change()
            }
         } catch (error) {
            console.error("ERROR in fetching address ", error)
         }
      }
   }

   render() {

      return (
         <div className="address-fields">
            <form>
               <div className="row">
                  <div className="col-sm-12">
                     <div className="fields-block">
                        <label className="title required">Full name</label>
                        <Field
                           name="name"
                           component={renderField}
                           type="text"
                           className="form-control"
                           placeholder="Enter name here"
                           autofocus="true"
                           onBlur={(e) => {
                              const name = e.target.value.replace(/^\s+/, '').replace(/\s+$/, '').split(' ');
                              this.props.change('firstname', name[0]);
                              typeof name[1] !== 'undefined' && this.props.change('lastname', name[1]);
                              return null;
                           }}
                        />
                     </div>
                  </div>
                  <div className="col-sm-6">
                     <div className="fields-block with-mob">
                        <label className="title required">Mobile number</label>
                        <div className="static-value">+91</div>
                        <Field
                           name="telephone"
                           component={renderField}
                           type="text"
                           className="form-control"
                           maxLength="10"
                           placeholder="Enter mobile numbere here"
                        />
                     </div>
                  </div>
                  <div className="col-sm-6">
                     <div className="fields-block">
                        <label className="title required">Pincode</label>
                        <Field
                           name="postcode"
                           component={renderField}
                           onChange={this.onChangePostalCode.bind(this)}
                           type="text"
                           className="form-control"
                           maxLength="6"
                           minLength="6"
                           placeholder="Enter pincode here"
                        />
                     </div>
                  </div>
                  <div className="col-sm-6">
                     <div className="fields-block">
                        <label className="title required">State</label>
                        <div className="dropdown">
                           <RegionsDropdown selectedValue={this.props.region_id}
                              callback={this.updateRegions.bind(this)} />
                           <Field
                              name="region_hidden"
                              component={renderField}
                              type="hidden"
                           />
                        </div>
                     </div>
                  </div>
                  <div className="col-sm-6">
                     <div className="fields-block">
                        <label className="title required">City/Town</label>
                        <Field
                           name="city"
                           component={renderField}
                           type="text"
                           className="form-control"
                           placeholder="Enter delivery city/town"
                        />
                     </div>
                  </div>

                  <FieldArray name="street" component={StreetAddressBlock} />

                  <div className="col-sm-12">
                     <div className="fields-block">
                        <label className="title">Instructions <span className="optional">(Optional)</span></label>
                        <Field
                           name="instructions"
                           component="textarea"
                           className="form-control"
                           placeholder="Any instruction please add here"
                        />
                     </div>
                  </div>
                  <div className="col-sm-12">
                     <div className="fields-block">
                        <label className="title">Address Type</label>
                        <div className="multiple-fields">
                           <div className="custom-radio-ui">
                              <label>
                                 <Field
                                    name="address_type"
                                    component="input"
                                    type="radio"
                                    className="option-input"
                                    value="home"
                                 />
                                 <span className="filter-input">Home</span>
                              </label>
                           </div>
                           <div className="custom-radio-ui">
                              <label>
                                 <Field
                                    name="address_type"
                                    component="input"
                                    type="radio"
                                    className="option-input"
                                    value="work"
                                 />
                                 <span className="filter-input">Office/Commercial</span>
                              </label>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-sm-12">
                     <div className="fields-block default-address-field">
                        <div className="custom-checkbox-ui">
                           <label>
                              <Field
                                 name="is_default"
                                 component="input"
                                 type="checkbox"
                                 className="option-input"
                                 value="1"
                              />
                              <span className="filter-input">Make this my default address</span>
                           </label>
                        </div>
                     </div>
                  </div>
               </div>
            </form>
         </div>
      );
   }
}

const f = reduxForm({
   form: 'delivery_address',
   destroyOnUnmount: true,
   enableReinitialize: true,
   keepDirtyOnReinitialize: true,
   validate
})(AddAddressBlock);

const mapStatesToProps = (state) => {
   return {
      region_id: typeof state.form.delivery_address !== 'undefined' && typeof state.form.delivery_address.values !== 'undefined' ? state.form.delivery_address.values.region_id : 0,
      regions: state.Cart.regions,
   }
}

export default connect(mapStatesToProps)(f);