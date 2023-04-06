import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux'; 
import {saveShippingAddress} from '../../actions/customer';

class SaveAddressButton extends Component {

  constructor(props){
      super(props);
      this.state = {
        submitting : false
      };
   }

  submit(values){
    const { onHide, callback } = this.props;
    if(!this.state.submitting){
      this.setState({
        submitting: true
      });
      this.props.saveShippingAddress(values, callback).then(response => {
        onHide();
      }).catch(error => {
        this.setState({
          submitting: false
        });
      });
    }
  }

  render() {
      const { handleSubmit } = this.props;

      return (
          <a href="javascript:void(0);" className={`btn-fil-primary large-btn saveprofile-btn vam load ${this.state.submitting ? 'show' : ''}`} onClick={handleSubmit(this.submit.bind(this))}>{this.state.submitting ? 'Saving' : 'Save'}</a>
      );
  }
}

const shippingAddressForm = reduxForm({
  form: 'delivery_address' // a unique identifier for this form
})(SaveAddressButton);

export default connect(null, {saveShippingAddress})(shippingAddressForm);