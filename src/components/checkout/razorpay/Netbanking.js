import React, { Component } from 'react';
import {currencyFormat} from '../../../utilities';
import Error from '../../Error';
import Dropdown from '../../Dropdown';

class Netbanking extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedOption : props.selectedOption,
      disableOptions: props.disableOptions,
      code: 'netbanking',
      errors: {},
      processing: false
    };

    this.selectBank = this.selectBank.bind(this);
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

  selectBank(bank){
    const $ = window.$$;
    $(this.refs.bank.refs.selectpicker).val(bank);
    if($(this.refs.bank.refs.selectpicker).next('.bootstrap-select').length > 0){
      $(this.refs.bank.refs.selectpicker).selectpicker('refresh');
    }
  }

  placeOrder(){
    let {code} = this.state;
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
        method: code,
        bank: selectpicker.value
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
    const {code, selectedOption, disableOptions, errors, processing} = this.state;
    const popularBanks = {SBIN: 'SBI', HDFC: 'HDFC', ICIC: 'ICICI', UTIB: 'AXIS', KKBK: 'KOTAK', YESB: 'YES', PUNB_R: 'PNB', CNRB: 'CANARA'};
    const bankOptions = {'0': 'Select Bank', ...this.props.banks};
    return (
      <div key={code} className="list-payment-methods">
        <div className="check-action-block-payment banking-ui">
          <div className="head-other-mathod">
            <div className="custom-radio-ui">
              <label onClick={this.triggerClick}>
                <input disabled={disableOptions} checked={selectedOption == code && !disableOptions} onChange={this.handleChange.bind(this)} defaultValue={code} type="radio" className="option-input" name="method" />
                <span className="filter-input"><img width="19" src="/assets/images/netbanking.png" alt="Net Banking" /> Net Banking</span>
              </label>
            </div>
            {
              selectedOption == code && !disableOptions
              &&
              <div className="block-bank-account-detail">
                <div className="block-content-smple">
                    {/*<label className="title">Net Banking</label>*/}
                      <div className="option-netbanking">
                          <div className="net-banking-list">
                            <ul>
                              {
                                Object.keys(popularBanks).map((b, i) => {
                                  return <li key={i}>
                                          <div className="custom-radio-ui">
                                            <label><input defaultValue={b} className="option-input" type="radio" name="bank-list" onClick={(e) => this.selectBank(b)} /><span className="filter-input"><img width="25" src={`https://cdn.razorpay.com/bank/${b}.gif`} alt="" /><span>{popularBanks[b]}</span></span></label>
                                          </div>
                                        </li>
                                })
                              }
                            </ul>
                            
                        </div>
                          <div className="dropdown">
                             <Dropdown ref="bank" options={bankOptions} name="bank" />
                             {typeof errors.bank !== 'undefined' && <Error text={errors.bank} />}
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

export default Netbanking;