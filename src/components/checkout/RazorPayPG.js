import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { loadScript, clearCart, trackwebEngageEvent } from '../../utilities';
import { createRazorPayOrderByQoute, fetchPaymentInfo, saveOrderId } from '../../actions/checkout';
import Card from './razorpay/Card';
import Netbanking from './razorpay/Netbanking';
import Upi from './razorpay/Upi';
import GooglePayUpi from './razorpay/GooglePayUpi';
import BhimUpi from './razorpay/BhimUpi';
import Wallet from './razorpay/Wallet';
import { PAYMENT_FAILURE, RAZORPAYLIVEID } from '../../constants';

class RazorPayPG extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: props.selectedOption,
      item: props.item,
      disableOptions: props.disableOptions,
      shippingAddress: props.shippingAddress,
      paymentMethods: {},
      processing: false,
      rzp: null,
      orderId: null,
      cart: props.cart
    };
    this.responseHandler = this.responseHandler.bind(this);
    this.setPaymentMethods = this.setPaymentMethods.bind(this);
    this.fetchPaymentMethods = this.fetchPaymentMethods.bind(this);
    this.startPaymentProcess = this.startPaymentProcess.bind(this);
    this.createPayment = this.createPayment.bind(this);
    this.toggleProcessing = this.toggleProcessing.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedOption != this.state.selectedOption) {
      this.setState({
        selectedOption: nextProps.selectedOption
      });
    }

    if (nextProps.disableOptions != this.state.disableOptions) {
      this.setState({
        disableOptions: nextProps.disableOptions
      });
    }

    if (nextProps.cart && this.state.status != nextProps.status) {
      this.setState({
        cart: nextProps.cart,
        status: nextProps.status
      });
    }

    if (nextProps && nextProps.order_price_summary && nextProps.order_price_summary.statusCode === "200") {
      this.setState({
        order_summary: nextProps.order_price_summary
      })
    }
  }

  componentDidMount() {
    this.fetchPaymentMethods();
  }

  toggleProcessing($this, value, errors) {
    const { parentRef } = this.props;
    console.log(parentRef);
    this.setState({
      processing: value
    });
    $this.setState({
      processing: value,
      errors: typeof errors !== 'undefined' ? errors : {}
    });
    if (parentRef) {
      parentRef.setState({
        processing: value
      });
    }
  }

  fetchPaymentMethods() {
    const { disableOptions } = this.state;
    if (disableOptions) {
      return;
    }
    const scriptUrl = 'https://checkout.razorpay.com/v1/razorpay.js';
    loadScript(this.setPaymentMethods, 'razorpay-checkout', scriptUrl);
  }

  setPaymentMethods() {
    const config = {
      key: RAZORPAYLIVEID
    };

    const rzp = new window.Razorpay(config);
    rzp.once('ready', (response) => {
      if (typeof response === 'undefined')
        return;

      this.setState({
        paymentMethods: response.methods,
        rzp
      });
    });
  }

  startPaymentProcess(config, $this) {
    const { rzp, processing, item, shippingAddress } = this.state;
    const { cart } = this.props;
    let defaultConfig = { currency: "INR" };
    if (processing === true) {
      return;
    }

    const cartItems = [];    

    if (this.state.cart && this.state.cart.items) {
      this.state.cart.items.map(item => {
        cartItems.push({
          'item_id': `${item.extension_attributes.skuu}`,
          'item_name': item.name,
          'coupon': this.state.usedCoupon ? this.state.usedCoupon.code : "",
          'discount': item.discount_amount ? Number(item.discount_amount) : 0,
          'item_category': item.extension_attributes.category,
          'price': Number(item.base_row_total_incl_tax),
          'quantity': item.qty
        });
      });
    }
    
    if (window.gtag) {
      window.gtag('event', 'add_payment_info', {
        'currency': "INR",
        'value': this.state.order_summary && this.state.order_summary.grand_total ? this.state.order_summary.grand_total.amount : 0,
        'coupon': this.state.usedCoupon ? this.state.usedCoupon.code : "",
        'payment_type': this.state.item ? this.state.item.code : '',
        'items': cartItems
      });
    }

    this.toggleProcessing($this, true);

    // const payload = {
    //     paymentMethod: {
    //         method: item.code
    //     },
    //     billing_address: shippingAddress
    //   };

    // if(typeof cart !== 'undefined' && typeof cart.total_segments !== 'undefined' && typeof cart.total_segments.grand_total !== 'undefined'){
    //   defaultConfig = {...defaultConfig, amount: parseFloat(cart.total_segments.grand_total.value) * 100};
    // }

    //console.log('NEWTESTING', {...defaultConfig, ...config});
    //return;
    rzp.createPayment({}, {
      paused: true,
      message: 'Confirming your order...'
    }
    );
    //return;
    // if(this.state.orderId){
    //   // Create order on RazorPay
    //   createRazorPayOrder(this.state.orderId).then(response => {
    //     if(response.data[0].success === true){
    //       this.createPayment(rzp, response.data[0], config, $this);
    //     }else{
    //       this.toggleProcessing($this, false);
    //     }
    //   }).catch(error => {
    //     this.toggleProcessing($this, false);
    //   });
    // }else{
    // fetchPaymentInfo(payload).then(response => {
    //   const orderId = response.data;
    //   this.setState({
    //     orderId
    //   });
    // Create order on RazorPay
    createRazorPayOrderByQoute().then(response => {
      if (response.data.success === true) {
        console.log("createRazorPayOrderByQoute >>> ", response.data);
        // RAZORPAYLIVEID = response.data
        this.createPayment(rzp, response.data, config, $this);
      } else {
        this.toggleProcessing($this, false);
      }
    }).catch(error => {
      this.toggleProcessing($this, false);
    });
    // }).catch(error => {
    //   this.toggleProcessing($this, false);
    // });
    //}

  }

  createPayment(razorpay, response, config, $this) {
    const data = {
      key_id: response.key_id,
      amount: response.amount, // in currency subunits. Here 1000 = 1000 paise, which equals to ₹10
      currency: "INR",// Default is INR. We support more than 90 currencies.
      email: response.email,
      contact: response.contact,
      notes: {
        cart_id: response.order_id,
      },
      order_id: response.rzp_order,
    };
    // has to be placed within user initiated context, such as click, in order for popup to open.
    //razorpay.createPayment({...data, ...config});
    razorpay.emit('payment.resume', { ...data, ...config });

    razorpay.on('payment.success', (resp) => {
      console.log("resp >> ", resp);
      this.responseHandler(response.order_id, resp);
    });

    // will pass error object to error handler
    razorpay.on('payment.error', (resp) => {
      console.log("REPSONSE ERROR ", resp, " REPSONSE ", response)
      let error = {};
      trackwebEngageEvent(PAYMENT_FAILURE, {
        "Reason": resp.error ? resp.error.description : '',
        "Payment Mode": this.state.selectedOption ? this.state.selectedOption : '',
        "Total Amount": response.amount ? (response.amount) : 0,
      })

      if (typeof resp.error.field !== 'undefined') {
        error = { [resp.error.field]: resp.error.description };
      } else {
        ToastsStore.error(resp.error.description);
      }
      this.toggleProcessing($this, false, error);
    });
  }

  responseHandler(resp, response) {
    this.props.saveOrderId(resp, response.razorpay_payment_id, 'razorpay');
    console.log("RazorPayPG responseHandler >> ", this.props);
    // Clear cart
    clearCart();
    this.props.history.push('/order/success');
  }

  renderElement(method, value) {
    let element = null;
    const { onChange } = this.props;
    const { selectedOption, disableOptions, processing, paymentMethods } = this.state;
    // If method not enabled
    if (value === false)
      return element;

    switch (method) {
      case 'card':
        element = <Card mobile={this.props.mobile} onChange={onChange} startPaymentProcess={this.startPaymentProcess} disableOptions={disableOptions} selectedOption={selectedOption} networks={paymentMethods.card_networks} credit_card={paymentMethods.credit_card} debit_card={paymentMethods.debit_card} />;
        break;

      case 'netbanking':
        element = Object.keys(value).length > 0 ? <Netbanking mobile={this.props.mobile} onChange={onChange} startPaymentProcess={this.startPaymentProcess} banks={value} disableOptions={disableOptions} selectedOption={selectedOption} /> : null;
        break;

      case 'googlepay':
        element = <GooglePayUpi mobile={this.props.mobile} onChange={onChange} startPaymentProcess={this.startPaymentProcess} disableOptions={disableOptions} selectedOption={selectedOption} />;
        break;

      case 'bhimupi':
        element = <BhimUpi mobile={this.props.mobile} onChange={onChange} startPaymentProcess={this.startPaymentProcess} disableOptions={disableOptions} selectedOption={selectedOption} />;
        break;

      case 'otherupi':
        element = <Upi mobile={this.props.mobile} onChange={onChange} startPaymentProcess={this.startPaymentProcess} disableOptions={disableOptions} selectedOption={selectedOption} />;
        break;

      case 'wallet':
        element = Object.keys(value).length > 0 ? <Wallet mobile={this.props.mobile} onChange={onChange} startPaymentProcess={this.startPaymentProcess} wallets={value} disableOptions={disableOptions} selectedOption={selectedOption} /> : null;
        break;
    }

    return element;
  }

  render() {
    let { paymentMethods } = this.state;

    if (typeof paymentMethods.upi !== 'undefined' && paymentMethods.upi === true) {
      paymentMethods = { ...paymentMethods, 'googlepay': true, 'bhimupi': true, 'otherupi': true }
    }

    return (
      <div className="payment-method-block radioList">
        <h6 className="payment-method-title">Online Payments</h6>
        {
          Object.keys(paymentMethods).map((method, index) => {
            return <React.Fragment key={index}>{this.renderElement(method, paymentMethods[method])}</React.Fragment>
          })
        }
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    shippingAddress: { ...state.Checkout.progress.shippingAddress },
    cart: { ...state.Cart.cart },
    order_price_summary: state.Cart && state.Cart.order_summary ? state.Cart.order_summary[0] : null
  };
}

export default withRouter(connect(mapStatesToProps, { saveOrderId })(RazorPayPG));