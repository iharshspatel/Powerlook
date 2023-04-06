import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import NewAddressModal from './NewAddressModal';
import {deleteShippingAddress} from '../../actions/customer';

class SavedAddressBlock extends Component {
  constructor(props){
    super(props);

    this.editAddress = this.editAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.selectAddress = this.selectAddress.bind(this);
  }

  editAddress(){
    const {data, defaultShippingId} = this.props;
    this.props.initialize({...data, is_default: defaultShippingId == data.entity_id, name: `${data.firstname} ${data.lastname}`, street: data.street.split("\n")});
    window.getFooter().setState({
      renderElement: <NewAddressModal title="Edit Address" onHide={this.hideModal.bind(this)} />
    });
  }

  deleteAddress(){
    const {entity_id} = this.props.data;
    if(window.confirm('Are you sure to delete this address?')){
      this.props.deleteShippingAddress(entity_id);
    }
  }

  selectAddress(){
    const {data, chooseBtnCallback} = this.props;  
    chooseBtnCallback(data);
    this.hideModal();
  }

  hideModal(){
      window.getFooter().setState({
          renderElement: null
      });
  }

  render() {
    const {address_type, firstname, lastname, street, city, region, postcode, telephone} = this.props.data;

    return (
        <div className="container-inner-address">
           <div className="address-block">
              <div className="head-address-in">
                 <h4>{firstname} {lastname}</h4>
                   {typeof address_type !== 'undefined' && <span className="address-type-view">{address_type}</span>}

                 <div className="edit-remove">
                    {
                      typeof this.props.chooseBtnCallback !== 'undefined'
                      ?
                      <a href="javascript:void(0);" className="btn edit" onClick={this.selectAddress}>SELECT</a>
                      :
                      <>
                        <a href="javascript:void(0);" className="btn edit" onClick={this.editAddress}>EDIT</a>
                        <a href="javascript:void(0);" className="btn remove" onClick={this.deleteAddress}>Remove</a>
                      </> 
                    }
                    
                 </div>
              </div>
              <div className="main-addess">
                 <address>{street}, {city} {region} - {postcode}</address>
                   {typeof telephone !== 'undefined' && <div className="contact-info">Mobile - +91 {telephone}</div>}
              </div>
           </div>
        </div>
    );
  }
}
const savedAddress = reduxForm({
  form: 'delivery_address'
})(SavedAddressBlock)

export default connect(null, {deleteShippingAddress})(savedAddress);
