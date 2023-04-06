import React, { Component } from 'react';
import Error from '../../Error';

class Wallet extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedOption : props.selectedOption,
      disableOptions: props.disableOptions,
      wallet: props.wallet,
      errors: {},
      processing: false
    };
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
    let target = null;
    $('.list-payment-methods .check-action-block-payment.card-active').removeClass('card-active');
    if($(e.target).hasClass('check-action-block-payment')){
      target = e.target;
    }else{
      target = $(e.target).parents('.check-action-block-payment:eq(0)')[0]
    }
    $(target).addClass('card-active');
    $(target).find('input[type=radio]').trigger('click');
  }

  payNow(){
    let {wallet} = this.state;
    let errors = {};
    let expiryDate = [];
    const {selectpicker} = this.refs.bank.refs;

    if(!selectpicker.value.replace(/\s/, '').length){
      errors = {...errors, bank: 'Please select your bank'};
    }

    if(Object.keys(errors).length > 0){
      this.setState({
        errors
      });

      return;
    }

    this.props.startPaymentProcess(
      {
        method: 'wallet',
        bank: wallet
      },
      this
    );
  }

  render() {
    const {wallet, selectedOption, disableOptions, errors, processing} = this.state;

    return (
      <div key={wallet} className="list-payment-methods">
        <div className="check-action-block-payment" onClick={this.triggerClick}>
          <div className="head-other-mathod">
            <div className="custom-radio-ui">
              <label>
                <input disabled={disableOptions} checked={selectedOption == wallet && !disableOptions} onChange={this.props.onChange} defaultValue={wallet} type="radio" className="option-input" name="method" />
                <span className="filter-input"></span>
              </label>
            </div>
            <div className="block-bank-account-detail">
              <div className="block-content-smple">
                  <label className="title" style={{textTransform: 'capitalize'}}><img width="25" src={`https://cdn.razorpay.com/wallet-sq/${wallet}.png`} alt={wallet} /> {wallet}</label>
              </div>
              <div className="d-none m-t20">
                  <a href="javascript:void(0)" onClick={this.payNow.bind(this)} className={`btn-fil-primary loading ${processing === true ? "show" : ""}`}>Pay Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Wallet;