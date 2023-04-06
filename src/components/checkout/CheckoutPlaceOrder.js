import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PayUMoneyBolt from './PayUMoneyBolt'; 
import WalletPaymentOption from './WalletPaymentOption'; 
import PaymentOption from './PaymentOption';  
import RazorPayPG from './RazorPayPG';
import MobileGrandTotalBar from '../mobile/MobileGrandTotalBar';
import {selectPaymentMethod, fetchShippingInformation} from '../../actions/checkout';
import NoticeBox from '../NoticeBox';

class CheckoutPlaceOrder extends Component {

  constructor(props){
      super(props);
      this.state = {
        selectedOption: null,
      	paymentMethods: [],//props.paymentMethods,
      	nextStep: props.nextStep,
      	status: props.status,
        processing: false,
        disableOptions: props.disableOptions,
        gatewayRef: null,
        buttonLabel: 'Place Order'
      };

      this.handleChange = this.handleChange.bind(this);
      this.placeOrderCallback = this.placeOrderCallback.bind(this);
  }

  componentWillMount(){
    const {shippingAddress, shippingMethod} = this.props;
    this.props.fetchShippingInformation(shippingAddress, shippingMethod);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'checkout' && nextProps.status != this.state.status){
      this.setState({
        paymentMethods: nextProps.paymentMethods,
        nextStep: nextProps.nextStep,
        selectedOption: null,
        status: nextProps.status,
        processing: false
      });
    }else{
      if(nextProps.compName == 'checkout-processing' && nextProps.status != this.state.status){
        this.setState({
          processing: true
        });
      }
    }

    if(this.state.disableOptions != nextProps.disableOptions){
      this.setState({
        disableOptions: nextProps.disableOptions,
        selectedOption: nextProps.disableOptions ? null : this.state.selectedOption
      });
    }
  }

  handleChange(e){
    const {checked, value} = e.target;

    if(checked){
      if(value != 'cashondelivery'){
        this.props.selectPaymentMethod(0);
      }
      this.setState({
        selectedOption: value
      });
    }
  }

  placeOrderCallback($this, payNow){
    //console.log('here');
    this.setState({
      gatewayRef: $this,
      buttonLabel: typeof payNow === 'undefined' ? 'Pay Now' : 'Place Order'
    });
  }

  placeOrder(e){
    const {gatewayRef, buttonLabel} = this.state;
    if(gatewayRef){
      if(window.$$('.card-active').length > 0){
        window.$$('body, html').animate({scrollTop: window.$$('.card-active').offset().top + 'px'}, 500);
      }
      
      gatewayRef.placeOrder();
    }
  }

  renderElement(item){
		let element = null;
    const {selectedOption, disableOptions} = this.state;

		switch(item.code){
			// case 'pumbolt':
			// 	element = <PayUMoneyBolt selectedOption={selectedOption} onChange={this.handleChange} item={item}/>;
			// 	break;

      case 'walletsystem':
        element = <WalletPaymentOption parentRef={this} mobile={this.placeOrderCallback} item={item}/>;
        break;

      case 'razorpay':
        element = <RazorPayPG parentRef={this} mobile={this.placeOrderCallback} disableOptions={disableOptions} selectedOption={selectedOption} onChange={this.handleChange} item={item}/>;
        break;

			case 'cashondelivery':
				element = <PaymentOption parentRef={this} mobile={this.placeOrderCallback} disableOptions={disableOptions} selectedOption={selectedOption} onChange={this.handleChange} item={item}/>;
		}

		return element;
	}

  render() {
  	const {nextStep, processing, buttonLabel} = this.state;
    let {paymentMethods} = this.state;
    let isCODItem = false;
    paymentMethods = paymentMethods.filter((item, index) => {
      if(item.code === 'cashondelivery'){
        isCODItem = item;
        return false;
      }

      return true;
    });
    if(isCODItem !== false){
      paymentMethods = [...paymentMethods, isCODItem];
    }
    return (
      <>
          <div className="back_bar">
              <Link to="/checkout/address">
                  <img src="/assets/images/back-Btn-black.svg" alt="arrow-left" /> 
                  <span className="content">Payments</span>
              </Link>
              <div className="step-number">STEP 2/2</div>
          </div>
          <div className="m-box-whiten bottom-btn-margin">
              <NoticeBox />
              <div className="content-block-detail delivery-options-fields payment-method-blocks-ui m-block">
                 {
                    <div className="content-block-detail delivery-options-fields payment-method-blocks-ui">
                       <div className={`payment-container-block ${!paymentMethods.length ? 'loading-block' : ''}`}>
                          {
                            paymentMethods.map((item, index) => {
                              return <React.Fragment key={index}>{this.renderElement(item)}</React.Fragment>                       
                            })
                          }
                       </div>
                    </div>
                  }
              </div>
          </div>
          <div className="button-base-button">
              <MobileGrandTotalBar />
              <a href="javascript:void(0);" className={`btn-fil-primary load ${processing === true ? 'show' : ''}`} onClick={this.placeOrder.bind(this)}>{buttonLabel}</a>
              
          </div>
      </>
   	);
  }
}

const mapStatesToProps = (state) => {
  return {
    shippingAddress: state.Checkout.progress.shippingAddress,
    shippingMethod: state.Checkout.progress.shippingMethod,
    paymentMethods: [...state.Checkout.progress.paymentMethods],
    disableOptions: state.Checkout.disableOptions,
    nextStep: state.Checkout.nextStep,
    status: state.Checkout.status,
    compName: state.Checkout.compName
  }
}

export default connect(mapStatesToProps, {selectPaymentMethod, fetchShippingInformation})(CheckoutPlaceOrder);