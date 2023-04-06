import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import {withRouter} from 'react-router-dom';
import {fetchCustomerAddresses, fetchShippingMethodsMobile, deleteShippingAddress} from '../../actions/customer';
import {updateShippingMethod} from '../../actions/checkout';
import {updateDeliveryAddress} from '../../actions/checkout';
import MobileGrandTotalBar from './MobileGrandTotalBar';
import {isAuth} from '../../utilities';

class CustomerAddressBook extends Component {

    constructor(props){
      super(props);
      this.state = {
        selection: props.defaultShippingId,
        addresses: props.addresses,
        shippingMethods: props.shippingMethods,
        status: null,
        checkoutStatus: props.checkoutStatus,
        processing: false,
        loaded: false
      };

      this.verifyShippingAvailability = this.verifyShippingAvailability.bind(this);
      this.triggerClick = this.triggerClick.bind(this);
      this.editAddress = this.editAddress.bind(this);
      this.deleteAddress = this.deleteAddress.bind(this);
    }

    componentWillReceiveProps(nextProps){
      console.log(nextProps.compName, nextProps.status, this.state.status);
      if(nextProps.compName == 'addresses' && nextProps.status != this.state.status){
        this.setState({
          selection: nextProps.defaultShippingId,
          addresses: nextProps.addresses,
          status: nextProps.status,
          loaded: true
        });
      }else{
        if(nextProps.checkoutCompName == 'checkout' && nextProps.checkoutStatus != this.state.checkoutStatus && nextProps.shippingMethod !== null){
          this.props.history.push('/checkout/place-order');
        }else{
          if(nextProps.checkoutCompName == 'checkout' && nextProps.checkoutStatus != this.state.checkoutStatus){
            this.props.updateShippingMethod(nextProps.shippingMethods[0]);
          }
        }  
      }
    }

    verifyShippingAvailability(){
      const {selection, addresses} = this.state;
      if(this.state.processing === true || !selection)
        return;

      this.setState({
        processing: true
      });

      const {city, country_id, firstname, lastname, postcode, region, region_id, street, telephone, customer_id} = addresses.filter(address => address.entity_id == selection)[0];
      const shippingAddress = 
        {
        city, country_id, firstname, lastname, postcode, region, region_id, street: street.split("\n"), telephone, customer_id
      };

      this.props.fetchShippingMethodsMobile(shippingAddress).then(response => {
        this.props.updateDeliveryAddress(shippingAddress);
      }).catch(error => {
        this.setState({
          processing: false
        });
      });
    }

    selectAddress(event){
      this.setState({
        selection: event.target.value
      });
    }

    triggerClick(key){
      window.$$(`#address-block-${key}`).find('input[type=radio]').trigger('click');
    }

    editAddress(entity_id){
      this.props.history.push(`/checkout/add-address?id=${entity_id}`);
    }

    deleteAddress(entity_id){
      if(window.confirm('Are you sure to delete this address?')){
        this.props.deleteShippingAddress(entity_id);
      }
    }

    render() {
        const {addresses, selection, processing, loaded} = this.state;

        return (
            <>
              <div className={!loaded ? 'loading-block' : ''}>
                {
                  loaded
                  &&
                  (
                    addresses.length > 0
                    ?
                    addresses.map(address => {
                      return <div key={address.entity_id} className="list-check-options-block">
                                <div className={`check-action-block-payment ${selection == address.entity_id ? 'card-active' : ''}`} id={`address-block-${address.entity_id}`} onClick={() => this.triggerClick(address.entity_id)}>
                                   <div className="head-other-mathod">
                                      <div className="custom-radio-ui">
                                         <label>
                                            <input checked={selection == address.entity_id} defaultValue={address.entity_id} type="radio" className="option-input" name="paymentSelection" onChange={this.selectAddress.bind(this)} />
                                            <span className="filter-input"></span>
                                         </label>
                                      </div>
                                      <div className="address-block-detail">
                                         <h3>{address.firstname} {address.lastname}</h3>&nbsp;
                                         {address.address_type ? <div className="address-for">{address.address_type}</div> : ''}
                                         <div className="edit-remove">
                                          <a href="javascript:void(0);" className="btn edit" onClick={(e) => this.editAddress(address.entity_id)}>EDIT</a>
                                          <a href="javascript:void(0);" className="btn remove" onClick={(e) => this.deleteAddress(address.entity_id)}>Remove</a>
                                         </div>
                                         <address>{address.street}, {address.city} {address.region} - {address.postcode}</address>
                                         <div className="phone-no">+91 {address.telephone}</div>
                                      </div>
                                      
                                   </div>
                                </div>
                              </div>
                    })
                    :
                    <div className="no-record" style={{padding: '15px'}}>No address found!</div>
                  )
                }
              </div>
              <div className="button-base-button">
                  <MobileGrandTotalBar />
                  <a href="javascript:void(0);" className={`btn-fil-primary load ${processing === true ? 'show' : ''}`} onClick={this.verifyShippingAvailability}>Continue</a>
                  
              </div>
            </>
        );
    }
}

const mapStatesToProps = (state) => {
  return {
    addresses: [...state.Customer.addresses],
    defaultShippingId: state.Customer.defaultShippingId,
    shippingMethods: [...state.Customer.shippingMethods],
    shippingMethod: state.Checkout.progress.shippingMethod,
    status: state.Customer.status,
    compName: state.Customer.compName,
    checkoutStatus: state.Checkout.status,
    checkoutCompName: state.Checkout.compName
  }
}

export default withRouter(connect(mapStatesToProps, {fetchCustomerAddresses, updateDeliveryAddress, fetchShippingMethodsMobile, updateShippingMethod, deleteShippingAddress})(CustomerAddressBook));
