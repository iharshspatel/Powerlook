import React, { Component } from 'react';
import { connect } from 'react-redux';
import WalletPaymentOption from './WalletPaymentOption';
import PaymentOption from './PaymentOption';
import RazorPayPG from './RazorPayPG';
import { selectPaymentMethod, updateSelectedPaymentOption } from '../../actions/checkout';
import { getCart, getOrderSummary, removeCouponCode } from '../../actions/cart';
import { ToastsStore } from 'react-toasts';

class PaymentOptions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      paymentMethods: [],//props.paymentMethods,
      nextStep: props.nextStep,
      status: props.status,
      processing: false,
      disableOptions: props.disableOptions,
      usedCoupon: props.usedCoupon,
      checkoutText: props.checkoutText,
      selectedPaymentOption: null
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.compName == 'checkout' && nextProps.status != this.state.status) {
      this.setState({
        paymentMethods: nextProps.paymentMethods,
        nextStep: nextProps.nextStep,
        selectedOption: null,
        selectedPaymentOption: null,
        status: nextProps.status,
        processing: false
      });
    } else {
      if (nextProps.compName == 'checkout-processing' && nextProps.status != this.state.status) {
        this.setState({
          processing: true
        });
      }
      if (nextProps.checkoutText) {
        this.setState({
          checkoutText: nextProps.checkoutText
        })
      }
    }

    if (this.state.disableOptions != nextProps.disableOptions) {
      this.setState({
        disableOptions: nextProps.disableOptions,
        selectedOption: nextProps.disableOptions ? null : this.state.selectedOption,
        selectedPaymentOption: nextProps.disableOptions ? null : this.state.selectedPaymentOption
      });
    }

    if (this.state.usedCoupon != nextProps.usedCoupon) {
      this.setState({
        usedCoupon: nextProps.usedCoupon
      });
    }
  }

  handleChange(e) {
    const { checked, value } = e.target;
    
    if (checked) {
      const { usedCoupon } = this.state       

      value === 'cashondelivery' && usedCoupon && usedCoupon.isOnlyForPrepaid == "1" && this.removeCouponCodee(e)      

      if (value != 'cashondelivery') {
        this.props.selectPaymentMethod(0);
      }
      
      this.props.updateSelectedPaymentOption(value);

      this.setState({
        selectedOption: value,
        selectedPaymentOption: value
      });
    }
  }

  removeCouponCodee(){    
    const { processing } = this.state;
    if (processing === true)
      return;

    this.setState({
      processing: true
    });

    removeCouponCode().then(response => {
      this.setState({
        processing: false
      });
      ToastsStore.success("Coupon code is removed successfully.");
      // Refresh Totals
      if (typeof response.data[0].totals !== 'undefined') {
        this.props.saveWalletTotalsInfo(response.data[0].totals);
      } else {
        // this.setState({ ...this.state, usedCoupon: null })
        this.props.getCart();
        this.props.getOrderSummary()
      }      
    }).catch(error => {
      this.setState({
        processing: false
      });
      console.error("EORRER ", error)
      if (error && error.response && error.response.data && error.response.data[0]) {
        ToastsStore.error(error.response.data[0].message);
      }      
    });
  }

  renderElement(item) {
    let element = null;
    const { selectedOption, disableOptions, usedCoupon } = this.state;

    switch (item.code) {
      // case 'pumbolt':
      // 	element = <PayUMoneyBolt selectedOption={selectedOption} onChange={this.handleChange} item={item}/>;
      // 	break;

      case 'walletsystem':
        element = <WalletPaymentOption item={item} />;
        break;

      case 'razorpay':
        element = <RazorPayPG disableOptions={disableOptions} selectedOption={selectedOption} onChange={this.handleChange} item={item} />;
        break;

      case 'cashondelivery':
        element = <PaymentOption disableOptions={disableOptions} usedCoupon={usedCoupon} selectedOption={selectedOption} onChange={this.handleChange} item={item} />;
    }

    return element;
  }

  render() {
    const { nextStep } = this.state;
    let { paymentMethods } = this.state;
    let isCODItem = false;
    paymentMethods = paymentMethods.filter((item, index) => {
      if (item.code === 'cashondelivery') {
        isCODItem = item;
        return false;
      }

      return true;
    });
    if (isCODItem !== false) {
      paymentMethods = [...paymentMethods, isCODItem];
      //console.log('paymentMethods', paymentMethods);
    }
    return (
      <div className="block-payment">
        <div className="head-block-detail flex-row">
          <div className='d-flex flex-row'>
            <div className="counter-payment">3</div>
            <h3 className="title-payment">Payment Options</h3>
          </div>
          <div>
            <p className='deskmobo-payment-opt mt-3 mb-0'> {this.state.checkoutText}</p>
          </div>
        </div>
        {
          nextStep == 4
          &&
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

    );
  }
}

const mapStatesToProps = (state) => {
  return {
    paymentMethods: [...state.Checkout.progress.paymentMethods],
    disableOptions: state.Checkout.disableOptions,
    nextStep: state.Checkout.nextStep,
    status: state.Checkout.status,
    compName: state.Checkout.compName,
    usedCoupon: state.Checkout.usedCoupon,
    selectedPaymentOption: state.Checkout.selectedPaymentOption
  }
}

export default connect(mapStatesToProps, { selectPaymentMethod, getCart, getOrderSummary, updateSelectedPaymentOption })(PaymentOptions);