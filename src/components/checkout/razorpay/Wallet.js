import React, { Component } from 'react';
import Error from '../../Error';

class Wallet extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedOption : props.selectedOption,
      disableOptions: props.disableOptions,
      code: 'wallet',
      wallets: props.wallets,
      wallet: null,
      errors: {},
      processing: false
    };

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

  selectWallet(wallet){
    this.setState({
      wallet
    });
  }

  placeOrder(){
    let {wallet} = this.state;
    let errors = {};
    console.log('wallet', wallet);
    if(wallet === null){
      errors = {...errors, wallet: 'Please select a wallet'};
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
        wallet: wallet
      },
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
    const {code, wallets, selectedOption, disableOptions, errors, processing} = this.state;

    return (
      <div className="list-payment-methods">
        <div className="check-action-block-payment banking-ui">
          <div className="head-other-mathod">
            <div className="custom-radio-ui">
              <label onClick={this.triggerClick}>
                <input disabled={disableOptions} checked={selectedOption == code && !disableOptions} onChange={this.handleChange.bind(this)} defaultValue={code} type="radio" className="option-input" name="method" />
                <span className="filter-input"><img width="19" src="/assets/images/wallet.png" alt="Wallet" /> Wallet</span>
              </label>
            </div>
            {
              selectedOption == code && !disableOptions
              &&
              <div className="block-bank-account-detail">
                <div className="block-content-smple">
                  <div className="option-netbanking">
                      <div className="net-banking-list">
                        <ul>
                          {
                            Object.keys(wallets).map((b, i) => {
                              return wallets[b] === true ? <li key={i}>
                                      <div className="custom-radio-ui">
                                        <label><input defaultValue={b} className="option-input" type="radio" name="wallet-list" onClick={(e) => this.selectWallet(b)} /><span className="filter-input"><img width="25" src={`https://cdn.razorpay.com/wallet-sq/${b}.png`} alt="" /><span>{b}</span></span></label>
                                      </div>
                                    </li> : null
                            })
                          }
                        </ul>
                        {typeof errors.wallet !== 'undefined' && <Error text={errors.wallet} />}
                    </div>
                  </div>
                </div>
                {
                  typeof this.props.mobile === 'undefined'
                  &&
                  <div className="d-none m-t20">
                    <a href="javascript:void(0)" onClick={this.placeOrder} className={`btn-fil-primary loading ${processing === true ? "show" : ""}`}>Pay Now</a>
                  </div>
                }
                
              </div>
            }
          </div>
        </div>
      </div>

    );
  }
}

export default Wallet;