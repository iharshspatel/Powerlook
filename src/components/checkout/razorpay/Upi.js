import React, { Component } from 'react';
import Error from '../../Error';

class Upi extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedOption : props.selectedOption,
      disableOptions: props.disableOptions,
      code: 'otherupi',
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

  placeOrder(){
    let errors = {};
    const {upiId} = this.refs;

    if(!upiId.value.replace(/\s/, '').length){
      errors = {...errors, upiId: 'Please enter your UPI ID'};
    }

    if(Object.keys(errors).length > 0){
      this.setState({
        errors
      });

      return;
    }

    this.props.startPaymentProcess(
      {
        method: 'upi',
        vpa: upiId.value
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

    return (
      <div key={code} className="list-payment-methods">
        <div className="check-action-block-payment" onClick={this.triggerClick}>
          <div className="head-other-mathod">
            <div className="custom-radio-ui">
              <label>
                <input disabled={disableOptions} checked={selectedOption == code && !disableOptions} onChange={this.handleChange.bind(this)} defaultValue={code} type="radio" className="option-input" name="method" />
                <span className="filter-input"></span>
              </label>
            </div>
            <div className="block-bank-account-detail">
              <div className="block-content-smple">
                  <label className="title"><img width="25" src="/assets/images/upi.png" alt="UPI" /> More UPI</label>
                  {
                    selectedOption == code && !disableOptions
                    &&
                    <div className="option-netbanking upi-block">
                        <div className="dropdown">
                           <input ref="upiId" placeholder="Enter your UPI Address" type="text" />
                        </div>
                         {typeof errors.upiId !== 'undefined' && <Error text={errors.upiId} />}
                         {typeof errors.vpa !== 'undefined' && <Error text={errors.vpa} />}

                         {
                          typeof this.props.mobile === 'undefined' && selectedOption == code && !disableOptions
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
        </div>
      </div>

    );
  }
}

export default Upi;