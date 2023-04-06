import React, { Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {ToastsStore} from 'react-toasts';
import {loadScript, clearCart} from '../../utilities';
import {createRazorPayOrder, fetchPaymentInfo, saveOrderId} from '../../actions/checkout';
import Card from './razorpay/Card';
import Netbanking from './razorpay/Netbanking';
import Upi from './razorpay/Upi';
import GooglePayUpi from './razorpay/GooglePayUpi';
import BhimUpi from './razorpay/BhimUpi';
import Wallet from './razorpay/Wallet';
import {RAZORPAYLIVEID} from '../../constants';

class RazorPayPG extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedOption : props.selectedOption,
      item: props.item,
      disableOptions: props.disableOptions,
      shippingAddress: props.shippingAddress,
      paymentMethods: {},
      processing: false,
      rzp: null,
      orderId: null
    };
    this.responseHandler = this.responseHandler.bind(this);
    this.setPaymentMethods = this.setPaymentMethods.bind(this);
    this.fetchPaymentMethods = this.fetchPaymentMethods.bind(this);
    this.startPaymentProcess = this.startPaymentProcess.bind(this);
    this.createPayment = this.createPayment.bind(this);
    this.toggleProcessing = this.toggleProcessing.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.selectedOption != this.state.selectedOption){
      this.setState({
        selectedOption: nextProps.selectedOption
      });
    }

    if(nextProps.disableOptions != this.state.disableOptions){
      this.setState({
        disableOptions: nextProps.disableOptions
      });
    }
  }

  componentDidMount(){
    this.fetchPaymentMethods();
  }

  toggleProcessing($this, value, errors){
    this.setState({
      processing: value
    });
    $this.setState({
      processing: value,
      errors: typeof errors !== 'undefined' ? errors : {}
    });
  }

  fetchPaymentMethods(){
    const {disableOptions} = this.state;
    if(disableOptions){
      return;
    }
    const scriptUrl = 'https://checkout.razorpay.com/v1/razorpay.js';
    loadScript(this.setPaymentMethods, 'razorpay-checkout', scriptUrl);
  }

  setPaymentMethods(){
    const config = {
        key: RAZORPAYLIVEID
    };

    const rzp = new window.Razorpay(config);
    rzp.once('ready', (response) => {
      if(typeof response === 'undefined')
        return;

      this.setState({
        paymentMethods: response.methods,
        rzp
      });
    });
  }

  startPaymentProcess(config, $this){
    const {rzp, processing, item, shippingAddress} = this.state;
    const {cart} = this.props;
    let defaultConfig = {currency: "INR"};
    if(processing === true){
      return;
    }
    this.toggleProcessing($this, true);

    const payload = {
        paymentMethod: {
            method: item.code
        },
        billing_address: shippingAddress
      };

    // if(typeof cart !== 'undefined' && typeof cart.total_segments !== 'undefined' && typeof cart.total_segments.grand_total !== 'undefined'){
    //   defaultConfig = {...defaultConfig, amount: parseFloat(cart.total_segments.grand_total.value) * 100};
    // }

    //console.log('NEWTESTING', {...defaultConfig, ...config});
//return;
    rzp.createPayment({}, {
        paused: true,
        message: 'Confirming your order...'}
    );
    //return;
    if(this.state.orderId){
      // Create order on RazorPay
      createRazorPayOrder(this.state.orderId).then(response => {
        if(response.data[0].success === true){
          this.createPayment(rzp, response.data[0], config, $this);
        }else{
          this.toggleProcessing($this, false);
        }
      }).catch(error => {
        this.toggleProcessing($this, false);
      });
    }else{
      fetchPaymentInfo(payload).then(response => {
        const orderId = response.data;
        this.setState({
          orderId
        });
        // Create order on RazorPay
        createRazorPayOrder(orderId).then(response => {
          if(response.data[0].success === true){
            this.createPayment(rzp, response.data[0], config, $this);
          }else{
            this.toggleProcessing($this, false);
          }
        }).catch(error => {
          this.toggleProcessing($this, false);
        });
      }).catch(error => {
        this.toggleProcessing($this, false);
      });
    }
    
  }

  createPayment(razorpay, response, config, $this){
    const data = {
      amount: response.amount, // in currency subunits. Here 1000 = 1000 paise, which equals to ₹10
      currency: "INR",// Default is INR. We support more than 90 currencies.
      email: response.email,
      contact: response.contact,
      notes: {
        order_id: response.order_id,
      },
      order_id: response.rzp_order,
    };
    // has to be placed within user initiated context, such as click, in order for popup to open.
    //razorpay.createPayment({...data, ...config});
    razorpay.emit('payment.resume', {...data, ...config});

    razorpay.on('payment.success', (resp) => {
      this.responseHandler(response.order_id);
    });

    // will pass error object to error handler
    razorpay.on('payment.error', (resp) => {
      let error = {};
      if(typeof resp.error.field !== 'undefined'){
          error = {[resp.error.field]: resp.error.description};
      }else{
        ToastsStore.error(resp.error.description);
      }
      this.toggleProcessing($this, false, error);
    }); 
  }

  responseHandler(resp){
    this.props.saveOrderId(resp);
    // Clear cart
    clearCart();
    this.props.history.push('/order/success');
  }

  renderElement(method, value){
    let element = null;
    const {onChange} = this.props;
    const {selectedOption, disableOptions, processing, paymentMethods} = this.state;
    // If method not enabled
    if(value === false)
      return element;

    switch(method){
      case 'card':
        element = <Card onChange={onChange} startPaymentProcess={this.startPaymentProcess} disableOptions={disableOptions} selectedOption={selectedOption} networks={paymentMethods.card_networks} credit_card={paymentMethods.credit_card} debit_card={paymentMethods.debit_card} />;
        break;

      case 'netbanking':
        element = Object.keys(value).length > 0 ? <Netbanking onChange={onChange} startPaymentProcess={this.startPaymentProcess} banks={value} disableOptions={disableOptions} selectedOption={selectedOption} /> : null;
        break;

      case 'googlepay':
        element = <GooglePayUpi onChange={onChange} startPaymentProcess={this.startPaymentProcess} disableOptions={disableOptions} selectedOption={selectedOption} />;
        break;

      case 'bhimupi':
        element = <BhimUpi onChange={onChange} startPaymentProcess={this.startPaymentProcess} disableOptions={disableOptions} selectedOption={selectedOption} />;
        break;

      case 'otherupi':
        element = <Upi onChange={onChange} startPaymentProcess={this.startPaymentProcess} disableOptions={disableOptions} selectedOption={selectedOption} />;
        break;

      case 'wallet':
        element = Object.keys(value).length > 0 ? <Wallet onChange={onChange} startPaymentProcess={this.startPaymentProcess} wallets={value} disableOptions={disableOptions} selectedOption={selectedOption} /> : null;
        break;
    }

    return element;
  }

  render() {
    let {paymentMethods} = this.state;

    if(typeof paymentMethods.upi !== 'undefined' && paymentMethods.upi === true){
      paymentMethods = {...paymentMethods, 'googlepay': true, 'bhimupi': true, 'otherupi': true}
    }

    return (
      <>
        {
          Object.keys(paymentMethods).map((method, index) => {
           return <React.Fragment key={index}>{this.renderElement(method, paymentMethods[method])}</React.Fragment>                
          })
        }
      </>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    shippingAddress: {...state.Checkout.progress.shippingAddress},
    cart: {...state.Cart.cart}
  };
}

export default withRouter(connect(mapStatesToProps, {saveOrderId})(RazorPayPG));