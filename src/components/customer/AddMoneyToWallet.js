import React, { Component } from 'react';
import { connect } from 'react-redux';
import {ToastsStore} from 'react-toasts';
import {loadScript, currencyFormat} from '../../utilities';
import {createRazorPayAddMoneyOrder, addMoneyToCustomerWallet} from '../../actions/customer';

class AddMoneyToWallet extends Component {
  constructor(props){
    super(props);
    this.state = {
      processing: false
    };

    this.placeOrder = this.placeOrder.bind(this);
    this.launchRazorPay = this.launchRazorPay.bind(this);
  }

  startPaymentProcess(){
    if(this.state.processing === true)
        return;
    const amount = this.refs.amount.value.replace(/\s/, '');
    if(amount == '' || isNaN(amount)){
      ToastsStore.error(`Please add a valid amount.`);
      return;
    }
    this.setState({
      processing: true
    });
    // Create order on RazorPay
    createRazorPayAddMoneyOrder(amount).then(response => {
      const scriptUrl = 'https://checkout.razorpay.com/v1/checkout.js';
      if(response.data[0].success === true){
        loadScript(this.launchRazorPay, 'addmoney-razorpay-checkout', scriptUrl, response.data[0]);
      }else{
        this.setState({
          processing: false
        });
      }
    }).catch(error => {
      this.setState({
        processing: false
      });
    });
  }

  launchRazorPay(data){
    const options = {
        key: data.key_id,
        name: data.marchant_name,
        amount: data.amount,
        handler: (response) => {
            this.placeOrder(data);
        },
        order_id: data.rzp_order,
        modal: {
            ondismiss: () => {
                this.setState({
                  processing: false
                });
            }
        },
        notes: {
            merchant_order_id: data.order_id
        },
        prefill: {
            name: data.name,
            contact: data.contact,
            email: data.email
        }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  placeOrder(data){
    this.setState({
      processing: false
    });
    this.props.callback(true);
    window.$$(this.refs.amount).val('');
    ToastsStore.success(`An amount of ${currencyFormat(data.quote_amount, 'INR')} has been added to your Powerlook wallet successfully.`);
  }

  render() {
    const {processing} = this.state;

    return (
        <div className="add-money-field">
            <input ref="amount" type="text" className="form-control" placeholder="Enter amount to be added to wallet" />
            <input type="submit" className={`btn-fil-primary large-btn load ${processing === true ? "show" : ""}`} value="Add Money" onClick={this.startPaymentProcess.bind(this)} />
         </div>
    );
  }
}

export default AddMoneyToWallet;
