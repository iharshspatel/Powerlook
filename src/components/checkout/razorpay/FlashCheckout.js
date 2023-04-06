import React, { Component } from 'react';
import Error from '../../Error';

class FlashCheckout extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedOption : props.selectedOption,
      disableOptions: props.disableOptions,
      code: 'flashcheckout',
      errors: {},
      processing: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
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

  triggerClick(e){
    const $ = window.$$;
    $('.list-payment-methods .check-action-block-payment.card-active').removeClass('card-active');
    $(e.target).parents('.check-action-block-payment:eq(0)').addClass('card-active');
  }

  placeOrder(){

    this.props.startPaymentProcess(
      {},
      this
    );
  }

  handleChange(e){
    this.props.onChange(e);
    if(typeof this.props.mobile !== 'undefined'){
      this.props.mobile(this);
    }
  }

  render() {
    const {code, selectedOption, disableOptions, processing} = this.state;

    return (
      <div className="list-payment-methods">
        <div className="check-action-block-payment banking-ui">
          <div className="head-other-mathod">
            <div className="custom-radio-ui">
              <label onClick={this.triggerClick}>
                <input disabled={disableOptions} checked={selectedOption == code && !disableOptions} onChange={this.handleChange} defaultValue={code} type="radio" className="option-input" name="method" />
                <span className="filter-input"><span className="payment-ic-img"><img width="19" src="/assets/images/ic-card.svg" alt="Checkout" /></span>Credit / Debit cart / Netbanking / UPI / Google Pay</span>
              </label>
            </div>
            {
              typeof this.props.mobile === 'undefined' && selectedOption == code && !disableOptions
              &&
              <div className="block-bank-account-detail">
                <div className="d-none m-t20">
                    <a href="javascript:void(0)" onClick={this.placeOrder} className={`btn-fil-primary loading ${processing === true ? "show" : ""}`}>Pay Now</a>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

    );
  }
}

export default FlashCheckout;