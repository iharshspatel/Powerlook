import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {RESOLUTIONTYPE} from '../../constants';
import RadioButtons from '../fields/RadioButtons';
import SelectField from '../fields/SelectField';
import TextareaField from '../fields/TextareaField';
import TextField from '../fields/TextField';
import ReturnPickupAddress from '../fields/ReturnPickupAddress';
import RefundModeFields from '../fields/RefundModeFields';

const required = value => {
  return value ? undefined : 'This is a required field.';
};

class ExtraFields extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      fields: props.fields,
      resolutionType: props.resolutionType,
      refundMode: props.refundMode,
      _selectedRefundModeOption: '1',
      _selectedPackageCondition: '1',
      _selectedItemUnused: 'no',
      _selectedTagIntact: 'no', 
      _selectedOriginalPacking: 'no'     
    };
  }

  componentWillReceiveProps(nextProps){
    if(this.state.resolutionType != nextProps.resolutionType){
      this.setState({
        resolutionType: nextProps.resolutionType
      });
    }
    if(this.state.refundMode != nextProps.refundMode){
      this.setState({
        refundMode: nextProps.refundMode
      });
    }
  }

  SetPackageOption(e, field){
    if(field && field.inputname == 'package_condition'){
      this.setState({
        _selectedPackageCondition: e
      });
    }else if(field && field.inputname == 'item_used'){
      this.setState({
        _selectedItemUnused: e
      });
    }else if(field && field.inputname == 'tag_intact'){
      this.setState({
        _selectedTagIntact: e
      });
    }else if(field && field.inputname == 'original_packing'){
      this.setState({
        _selectedOriginalPacking: e
      });
    }    
  }

  renderElement(field){
    let element = null;
    let validate = [];
    
    const { resolutionType, refundMode, _selectedRefundModeOption, _selectedPackageCondition, _selectedItemUnused, _selectedTagIntact, _selectedOriginalPacking } = this.state;
    // Server only fields
    //const hiddenFields = ['return_shipment_date', 'return_shipment_awb'];
    const bankDetailFields = ['refund_mode', 'bank_account_holder_name', 'bank_name', 'bank_account_number', 'account_type', 'ifsc_code'];
    const isBankDetailField = bankDetailFields.indexOf(field.inputname) > -1;

    let selectedPackagOption = ''
    if(field.inputname == 'package_condition'){
      selectedPackagOption = _selectedPackageCondition
    }else if(field.inputname == 'item_used'){
      selectedPackagOption = _selectedItemUnused
    }else if(field.inputname == 'tag_intact'){
      selectedPackagOption = _selectedTagIntact
    }else if(field.inputname == 'original_packing'){
      selectedPackagOption = _selectedOriginalPacking
    }

    // if(hiddenFields.indexOf(field.inputname) >= 0){
    //   return null;
    // }

    if((resolutionType == RESOLUTIONTYPE.EXCHANGE || resolutionType === null) && bankDetailFields.indexOf(field.inputname) >= 0){
      return null;
    }

    if(field.inputname != 'refund_mode' && typeof isBankDetailField !== 'undefined' && isBankDetailField){
      // If Refund mode is not Bank account
      if(refundMode != 2){
        return null;
      }
    }

    if(field.required == '1')
      validate=[required];

    switch(field.input_type){
      case 'radio':
        if (field.inputname == 'refund_mode')
          element = <Field payment_method={this.props.order.payment_method} validate={validate} name={field.inputname} 
          selectedRefundModeOption={_selectedRefundModeOption} setSelectedRefundModeOption={(e) => {
            this.setState({
              _selectedRefundModeOption: e
            })
          }} component={RefundModeFields} field={field} />;
        else
          element = <Field isBankDetailField={isBankDetailField} refundMode={refundMode} validate={validate} name={field.inputname} component={RadioButtons} field={field}
          selectedPackageOption={selectedPackagOption} setSelectedPackageOption={(e, field)=>this.SetPackageOption(e, field)}
          />;
        break;

      case 'select':
        element = <Field change={this.props.change} isBankDetailField={isBankDetailField} refundMode={refundMode} validate={validate} name={field.inputname} component={SelectField}  field={field} />;
        break;

      case 'textarea':
        if(field.inputname == 'return_pickup_address')
          element = <Field change={this.props.change} validate={validate} name={field.inputname} shipping={this.props.order.shipping_address} component={ReturnPickupAddress}  field={field} />;
        else  
          element = <Field isBankDetailField={isBankDetailField} refundMode={refundMode} validate={validate} name={field.inputname} component={TextareaField}  field={field} />;
        break;

      case 'text':
        element = <Field isBankDetailField={isBankDetailField} refundMode={refundMode} validate={validate} name={field.inputname} component={TextField}  field={field} />;
        break;

      default:
        element = null;
    }

    return element;
  }

  render() {
    const {fields} = this.state;

    return (
      <>
        {
          fields.map((field, index) => {
            return <React.Fragment key={index}>{this.renderElement(field)}</React.Fragment>
          })
        }
      </> 
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    resolutionType: typeof state.form.rma_request.values !== 'undefined' && typeof state.form.rma_request.values.resolution_type !== 'undefined' ? state.form.rma_request.values.resolution_type : null,
    refundMode: typeof state.form.rma_request.values !== 'undefined' && typeof state.form.rma_request.values.refund_mode !== 'undefined' ? state.form.rma_request.values.refund_mode : null
  }
}

export default connect(mapStatesToProps)(reduxForm({
  form: 'rma_request',
  destroyOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(ExtraFields))