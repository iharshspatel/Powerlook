import React, { Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {loadScript, clearCart} from '../../utilities';
import {ToastsStore} from 'react-toasts';
import {startPayment, fetchPaymentInfo, callbackPayUMoney, saveOrderId} from '../../actions/checkout';

class PayUMoneyBolt extends Component {

  constructor(props){
  	super(props);
  	this.state = {
  		selectedOption : props.selectedOption,
  		item: props.item,
  		shippingAddress: props.shippingAddress,
      processing: false,
      orderId: null
  	};
  	this.responseHandler = this.responseHandler.bind(this);
  	this.catchException = this.catchException.bind(this);
  	this.launchBolt = this.launchBolt.bind(this);
  }

  componentWillReceiveProps(nextProps){
  	if(nextProps.selectedOption != this.state.selectedOption){
  		this.setState({
  			selectedOption: nextProps.selectedOption
  		});
  	}
  }

  startPaymentProcess(){
    if(this.state.processing === true)
        return;
    this.setState({
      processing: true
    });
  	const {item, shippingAddress} = this.state;
  	const payload = {
				paymentMethod: {
			    	method: item.code
				},
				billing_address: shippingAddress
		};
    if(this.state.orderId){
        startPayment(this.state.orderId).then(response => {
          const requestData = JSON.parse(response.data);
          loadScript(this.launchBolt, requestData.scriptId, requestData.action, requestData.data, {['bolt-color']: requestData.boltColor, ['bolt-logo']: requestData.boltLogo});
        });
    }else{
      fetchPaymentInfo(payload).then(response => {
        const orderId = response.data;
        this.setState({
            orderId
        });
        startPayment(orderId).then(response => {
          const requestData = JSON.parse(response.data);
          loadScript(this.launchBolt, requestData.scriptId, requestData.action, requestData.data, {['bolt-color']: requestData.boltColor, ['bolt-logo']: requestData.boltLogo});
        });
      }).catch(error => {
        this.setState({
          processing: false
        });
      });
    }
  	
  }

  launchBolt(requestData){
  	window.bolt.launch( requestData , {responseHandler: this.responseHandler, catchException: this.catchException} );
  }

  responseHandler(BOLT){
  	// your payment response Code goes here, BOLT is the response object
  	if(BOLT.response.txnStatus == 'SUCCESS'){
  		if(BOLT.response.status != 'success'){
  			//window.location.reload();
        if(BOLT.response.txnMessage.length > 0){
          ToastsStore.error(BOLT.response.txnMessage);
        }
        this.setState({
          processing: false
        });
  			return;
  		}
      // Clear cart
      clearCart();
      this.props.saveOrderId(BOLT.response.txnid);
      this.props.history.push('/order/success');

  		// callbackPayUMoney(BOLT.response).then(response => {
  		// 	const orderId = BOLT.response.txnid;
  		// 	this.props.saveOrderId(orderId);
  		// 	if(typeof response.data[0] !== 'undefined'){
  		// 		switch(response.data[0]){
  		// 			case 'success':
  		// 				this.props.history.push('/order/success');
  		// 				break;

  		// 			case 'cancelled':
  		// 				this.props.history.push('/order/cancelled');
  		// 				break;
  		// 		}
  		// 	}
  		// });
  	}else{
  		if(BOLT.response.txnStatus == 'FAILED' || BOLT.response.txnStatus == 'CANCEL'){
        if(BOLT.response.txnMessage.length > 0){
          ToastsStore.error(BOLT.response.txnMessage);
        }
        this.setState({
          processing: false
        });
      }
  	}
  }

  catchException(BOLT){
  	console.log('error', BOLT);
  	// the code you use to handle the integration errors goes here
    ToastsStore.error(BOLT.message);
    this.setState({
      processing: false
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

  render() {
  	const {item, selectedOption, disableOptions, processing} = this.state;

    return (
    	<div key={item.code} className="list-payment-methods">
			<div className="check-action-block-payment" onClick={this.triggerClick}>
				<div className="head-other-mathod">
					<div className="custom-radio-ui">
						<label>
							<input disabled={disableOptions} checked={selectedOption == item.code && !disableOptions} onChange={this.props.onChange} defaultValue={item.code} type="radio" className="option-input" name="method" />
							<span className="filter-input"></span>
						</label>
					</div>
					<div className="block-bank-account-detail">
                      <div className="card-name-type">
                         <div className="card-name">
                            <label>Debit/Credit Card and Netbanking
                              <span style={{
                                    display: "block",
                                    fontSize: "11px",
                                    fontWeight: "normal"
                                }}>Powered by PayU</span>
                            </label>
                         </div>
                      </div>
                      {
                      	selectedOption == item.code && !disableOptions
                      	&&
                      	<div className="enter-cvv">
	                         <button onClick={this.startPaymentProcess.bind(this)} className={`btn-fil-primary loading ${processing === true ? "show" : ""}`}>Pay Now</button>
	                      </div>
                      }
                   </div>
				</div>
			</div>
	    </div>

   	);
  }
}

const mapStatesToProps = (state) => {
	return {
		shippingAddress: {...state.Checkout.progress.shippingAddress}
	};
}

export default withRouter(connect(mapStatesToProps, {saveOrderId})(PayUMoneyBolt));