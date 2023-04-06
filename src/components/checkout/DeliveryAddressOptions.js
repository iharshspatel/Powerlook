import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import NewAddressModal from '../customer/NewAddressModal';
import CustomerAddressBook from '../customer/CustomerAddressBook';
import {updateCheckoutToStep} from '../../actions/checkout';

class DeliveryAddressOptions extends Component {

  constructor(props){
      super(props);
      this.state = {
        shippingAddress: props.shippingAddress,
        nextStep: props.nextStep,
        status: props.status
      };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'checkout' && nextProps.status != this.state.status){
      this.setState({
        shippingAddress: nextProps.shippingAddress,
        nextStep: nextProps.nextStep,
        status: nextProps.status
      });
    }
  }

  addNewAddress(){
    window.getFooter().setState({
      renderElement: <NewAddressModal onHide={this.hideModal.bind(this)} />
    });
  }

  hideModal(){
      window.getFooter().setState({
          renderElement: null
      });
  }

  render() {
    const {nextStep, shippingAddress} = this.state;

    return (
      <div className={`block-payment ${nextStep > 1 ? 'done-block' : ''}`}>
        <div className="head-block-detail">
           <div className="counter-payment">1</div>
           <h3 className="title-payment">Select Delivery Address</h3>
           <div className="right-block-detail">
              {
                nextStep > 1
                ?
                <div className="change-option-ui">
                  <a href="javascript:void(0);" className="change-option-text" onClick={() => this.props.updateCheckoutToStep(1)}>Change Address</a>
                </div>
                :
                <div className="add-new-address-block">
                   <a href="javascript:void(0);" className="add-btn" onClick={this.addNewAddress.bind(this)}>
                      <span className="icon-add"></span><span className="text">Add New Address</span>
                   </a>
                </div>
              } 
           </div>
           {
            nextStep > 1
            &&
            <div className="block-result-detail">
              <address>{shippingAddress ? shippingAddress.street.join("\n") + ', ' + shippingAddress.city + ' ' + shippingAddress.region + ' - ' + shippingAddress.postcode : ''}</address>
            </div>
           }
           
        </div>
        {
          nextStep == 1
          &&
          <div className="content-block-detail">
             <CustomerAddressBook />
          </div>
        }
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    shippingAddress: state.Checkout.progress.shippingAddress,
    nextStep: state.Checkout.nextStep,
    status: state.Checkout.status,
    compName: state.Checkout.compName
  }
}

export default connect(mapStatesToProps, {updateCheckoutToStep})(DeliveryAddressOptions);