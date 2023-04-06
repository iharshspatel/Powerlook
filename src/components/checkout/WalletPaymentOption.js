import React, { Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {clearCart, currencyFormat, getSessionItem} from '../../utilities';
import {applyWalletBalance, saveWalletTotalsInfo, fetchPaymentInfo, saveOrderId} from '../../actions/checkout';

class WalletPaymentOption extends Component {

  constructor(props){
  	super(props);
  	this.state = {
  		item: props.item,
      shippingAddress: props.shippingAddress,
      checked: false,
      processing: false,
      placeOrderProcessing: false,
      walletInfo: null,
      status: props.status
  	};
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'update-wallet-details' && nextProps.status != this.state.status){
      this.setState({
        walletInfo: nextProps.walletInfo,
        status: nextProps.status,
      });
    }
  }

  applyWalletBalance(e){
    const {checked} = e.target;
    this.setState({
      processing: true,
      checked
    });
    applyWalletBalance({wallet: (checked ? 'set' : 'reset')}).then(response => {
      this.props.saveWalletTotalsInfo(response.data);
      this.setState({
        processing: false,
        walletInfo: response.data[0]
      });
      if(typeof this.props.mobile !== 'undefined' && response.data[0] !== null && parseInt(response.data[0].left_amount_topay) == 0){
        this.props.mobile(this, false);
      }
      
    }).catch(error => {
      this.setState({
        processing: false
      });
    });
  }

  placeOrder(){
    const {mobile, parentRef} = this.props;
    if(this.state.placeOrderProcessing === true)
        return;
    this.setState({
      placeOrderProcessing: true
    });
    parentRef && parentRef.setState({
      processing: true
    });
    const {item, shippingAddress} = this.state;
    const payload = {
        cartId: getSessionItem('cartId'),
        paymentMethod: {
            method: item.code
        },
        billing_address: shippingAddress
      };
    fetchPaymentInfo(payload).then(response => {
      const orderId = response.data;
      this.props.saveOrderId(orderId);
      // Clear cart
      clearCart();
      this.props.history.push('/order/success');
    }).catch(error => {
      this.setState({
        placeOrderProcessing: false
      });
      parentRef && parentRef.setState({
        processing: false
      });
      // Clear cart
      //clearCart();
      //this.props.history.push('/order/cancelled');
    });
  }

  triggerClick(e){
    const $ = window.$$;
    let target = null;
    $('.wallet-payment-block').toggleClass('wallet-card-active');
    $('.wallet-payment-block').find('input[type=checkbox]').trigger('click');
  }

  render() {
    let appliedBalance = 0;
  	const {item, walletInfo, checked, processing, placeOrderProcessing} = this.state;
    const walletBalance = walletInfo !== null ? walletInfo.left_in_wallet : item.wallet_amount;
    if(checked === true && walletInfo !== null){
     appliedBalance = item.wallet_amount > walletInfo.grand_total ? walletInfo.grand_total : item.wallet_amount;
    }
    return (  
      <div className="payment-method-block">
        <h6 className="payment-method-title">Powerlook Wallet</h6>
      	<div key={item.code} className={`list-payment-methods ${processing ? 'loading-block' : ''}`}>
    			<div className={`check-action-block-payment wallet-payment-block ${checked === true ? 'wallet-card-active' : ''}`}>
    				<div className="head-other-mathod">
              {
                item.wallet_amount > 0
                ?
                <>
                  <div className="custom-checkbox-ui">
                    <label>
                      <input onChange={this.applyWalletBalance.bind(this)} defaultValue={item.code} type="checkbox" className="option-input" />
                      <span className="filter-input"></span>
                    </label>
                  </div>
                  <div className="block-bank-account-detail">
                      <div className="card-name-type" onClick={this.triggerClick}>
                         <div className="card-name">
                            <span className="payment-ic-img"><img width="" src="/assets/images/ic-wallet.svg" alt="Checkout" /></span>
                            <label> Use your Powerlook balance <span className="wallet-amount">{currencyFormat(parseFloat(walletBalance).toFixed(2), 'INR')}</span></label>
                         </div>
                      </div>
                      {
                        checked === true && walletInfo !== null
                        &&
                        <div className="priceBreakUp-base-orderSummary">
                          <div className="priceDetail-base-row">
                            <span className="s-title">Order Amount</span>
                            <span className="priceDetail-base-value">{currencyFormat(parseFloat(walletInfo.grand_total).toFixed(2), 'INR')}</span>
                          </div>
                          <div className="priceDetail-base-row">
                            <span className="s-title">Wallet Amount</span>
                            <span className="priceDetail-base-value priceDetail-base-discount">- {currencyFormat(parseFloat(appliedBalance).toFixed(2), 'INR')}</span>

                            {/*<div className="remainingAmount">
                              <span className="s-title">Remaining </span>
                              <span className="priceDetail-base-value">{currencyFormat(parseFloat(walletInfo.left_in_wallet).toFixed(2), 'INR')}</span>
                            </div>*/}
                          </div>
                          <div className="priceDetail-base-row leftAmountBlock">
                            <span className="s-title">Left amount to be paid </span>
                            <span className="priceDetail-base-value">{currencyFormat(parseFloat(walletInfo.left_amount_topay).toFixed(2), 'INR')}</span>
                          </div>
                        </div>
                      }
                      {
                        typeof this.props.mobile === 'undefined' && checked === true && walletInfo !== null && parseInt(walletInfo.left_amount_topay) == 0
                        &&
                        <div className="enter-cvv">
                           <button onClick={this.placeOrder.bind(this)} className={`btn-fil-primary loading ${placeOrderProcessing === true ? "show" : ""}`}>Place Order</button>
                        </div>
                      }
                  </div>
                </>
                :
                <div className="block-bank-account-detail">
                    <div className="card-name-type">
                       <div className="card-name">
                          <label><strong>No balance is available in your Powerlook wallet.</strong></label>
                       </div>
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

const mapStatesToProps = (state) => {
  return {
    shippingAddress: {...state.Checkout.progress.shippingAddress},
    walletInfo: {...state.Checkout.walletDetails},
    status: state.Checkout.status,
    compName: state.Checkout.compName
  }
}

export default withRouter(connect(mapStatesToProps, {saveWalletTotalsInfo, saveOrderId})(WalletPaymentOption));