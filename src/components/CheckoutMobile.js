import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import { Switch, Route } from 'react-router-dom';
import {isAuth, getSessionItem, trackFBEvent} from '../utilities';
import CartSubTotalBlock from './checkout/CartSubTotalBlock';
import {clearCheckoutSteps} from '../actions/checkout';
import {ROUTES} from '../routes';
import '../mobile.css';

class CheckoutMobile extends Component {

  constructor(props){
  	super(props);

    this.state = {
      status: props.status
    };
  }

  componentWillMount(){
  	if(!isAuth() || !getSessionItem('cartId')){
  		this.props.history.push('/');
  	}else{
      this.props.clearCheckoutSteps();
      trackFBEvent('InitiateCheckout', {});
      if(this.props.nextStep == 1){
        this.props.history.push('/checkout/address');
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'empty-cart' && this.state.status != nextProps.status){
        this.props.history.push('/shopping-bag');
    }
  }

  render() {
  	
    return (
        <div className="main-wrapper">
          <div className="m-order-details">
            <Switch>
              <Route {...ROUTES.CHECKOUTADDRESS} />
              <Route {...ROUTES.CHECKOUTADDADDRESS} />
              <Route {...ROUTES.CHECKOUTPLACEORDER} />
            </Switch>
          </div>
        </div>
    );
  }
}

const mapStatesToProps = (state) => {
    return {
        nextStep: state.Checkout.nextStep,
        status: state.Cart.status,
        compName: state.Cart.compName
    };
}

export default connect(mapStatesToProps, {clearCheckoutSteps})(CheckoutMobile);