import React, { Component } from 'react';
import {loadScript} from '../../../utilities';
import Error from '../../Error';
import '../../../jquery.payment.js';
class Card extends Component {

  constructor(props){
  	super(props);
  	this.state = {
  		selectedOption : props.selectedOption,
      disableOptions: props.disableOptions,
      code: 'card',
      cardType: null,
      errors: {},
      processing: false
  	};

    this.formatCard = this.formatCard.bind(this);
    this.checkCardType = this.checkCardType.bind(this);
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

  componentDidUpdate(){
    this.formatCard();
  }

  formatCard(){
    const $ = window.$$;
    const {number, expiry, cvv} = this.refs;
    $(number).payment('formatCardNumber');
    $(expiry).payment('formatCardExpiry');
    $(cvv).payment('formatCardCVC');
  }

  checkCardType(){
    const $ = window.$$;
    this.setState({
      cardType: $.payment.cardType(this.refs.number.value)
    });
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
    let {code} = this.state;
    let errors = {};
    let expiryDate = [];
    const {name, number, expiry, cvv} = this.refs;
    if(!name.value.replace(/\s/, '').length){
      errors = {...errors, name: 'Please enter your name'};
    }
    if(!number.value.replace(/\s/, '').length){
      errors = {...errors, number: 'Please enter your card number'};
    }
    if(!expiry.value.replace(/\s/, '').length){
      errors = {...errors, expiry: 'Please enter card expiry date'}
    }else{
      expiryDate = expiry.value.split('/').filter(n => !isNaN(n) && n.replace(/\s/, '').length > 0);
      if(expiryDate.length != 2){
        errors = {...errors, expiry: 'Invalid expiry date'};
      }
    }
    if(!cvv.value.replace(/\s/, '').length){
      errors = {...errors, cvv: 'Please enter card cvv number'}
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
        'card[name]':  name.value,
        'card[number]': number.value.replace(/\s/g, ''),
        'card[cvv]': cvv.value.replace(/\s/g, ''),
        'card[expiry_month]': expiryDate[0].replace(/\s/g, ''),
        'card[expiry_year]': expiryDate[1].replace(/\s/g, '')
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
  	const {code, selectedOption, disableOptions, errors, processing, cardType} = this.state;
    
    return (
    	<div key={code} className="list-payment-methods">
  			<div className="check-action-block-payment" onClick={this.triggerClick}>
  				<div className="head-other-mathod">
  					<div className="custom-radio-ui">
  						<label>
  							<input disabled={disableOptions} checked={selectedOption == code && !disableOptions}  onChange={this.handleChange.bind(this)} defaultValue={code} type="radio" className="option-input" name="method" />
  							<span className="filter-input"></span>
  						</label>
  					</div>
  					<div className="block-content-smple add-new-card">
                <label className="title"><img width="25" src="/assets/images/creditcard.png" alt="Credit / Debit cards" /> Credit / Debit cards</label>
                {
                	selectedOption == code && !disableOptions
                	&&
                  <div className="add-card-v2">
                     <p className="sm-title-card">Enter your card information</p>
                     <div className="new-card-block-fields-v2">
                        <div className="fields-new card-no-new">
                           <label>Name on Card</label>
                           <input ref="name" type="text" className="form-control" />
                           {typeof errors.name !== 'undefined' && <Error text={errors.name} />}
                        </div>
                        <div className={`cc-number fields-new card-name-new ${cardType !== null ? cardType : ''}`}>
                           <label>Card Number</label>
                           <input type="tel" className="form-control" autoComplete="cc-number" placeholder="•••• •••• •••• ••••" required ref="number" onChange={this.checkCardType} />
                           {typeof errors.number !== 'undefined' && <Error text={errors.number} />}
                        </div>
                        <div className="fields-new card-expiry-new">
                           <label>Expiry</label>
                           <input ref="expiry" autoComplete="cc-exp" type="tel" placeholder="•• / ••" className="form-control" />
                           {typeof errors.expiry !== 'undefined' && <Error text={errors.expiry} />}
                           {typeof errors.expiry_month !== 'undefined' && <Error text={errors.expiry_month} />}
                           {typeof errors.expiry_year !== 'undefined' && <Error text={errors.expiry_year} />}
                        </div>
                        <div className="fields-new card-cvv-new">
                           <label>CVV</label>
                           <input ref="cvv" autoComplete="off" type="password" className="form-control" placeholder="•••" />
                           {typeof errors.cvv !== 'undefined' && <Error text={errors.cvv} />}
                        </div>
                        {
                          typeof this.props.mobile === 'undefined'
                          &&
                          <div className="submit-card-action">
                             <div className="btn-block">
                                <a href="javascript:void(0)" onClick={this.placeOrder} className={`btn-fil-primary loading ${processing === true ? "show" : ""}`}>Pay Now</a>
                             </div>
                          </div>
                        }
                        
                     </div>
                  </div>
                }
             </div>
  				</div>
  			</div>
	    </div>

   	);
  }
}

export default Card;