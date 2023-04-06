import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeaderCheckout from './HeaderCheckout';
import FooterCheckout from './FooterCheckout';
import { isAuth, getSessionItem, trackFBEvent } from '../utilities';
import CartSubTotalBlock from './checkout/CartSubTotalBlock';
import DeliveryAddressOptions from './checkout/DeliveryAddressOptions';
import DeliveryMethodOptions from './checkout/DeliveryMethodOptions';
import OrderSummary from './checkout/OrderSummary';
import PaymentOptions from './checkout/PaymentOptions';
import { clearCheckoutSteps } from '../actions/checkout';
import NoticeBox from './NoticeBox';
import { getCheckoutText } from '../actions/cart';

class Checkout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      status: props.status,
      checkoutText: null
    };
  }

  async componentWillMount() {
    try {
      let res = await getCheckoutText();
      this.setState({
        ...this.state,
        checkoutText: res.data[0].text
      })
    } catch (error) {
      console.error("ERROR WHILE FETCH CHECKOUT TEXT, error cause: ", error)
    }
    if (!isAuth() || !getSessionItem('cartId')) {
      this.props.history.push('/');
    } else {
      this.props.clearCheckoutSteps();
      trackFBEvent('InitiateCheckout', {});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.compName == 'empty-cart' && this.state.status != nextProps.status) {
      this.props.history.push('/shopping-bag');
    }
  }

  render() {

    return (
      <div className="main-wrapper">
        <HeaderCheckout />
        <div className="cart-block-container">
          <div className="container sm-container">
            <div className="row">
              <div className="col-sm-8 itemBlock-base-leftBlock">
                <NoticeBox />
                <DeliveryAddressOptions />
                <DeliveryMethodOptions />
                <OrderSummary />
                <PaymentOptions checkoutText={this.state.checkoutText} />
              </div>
              <CartSubTotalBlock hideBtn={true} checkoutText={this.state.checkoutText} />
            </div>
          </div>
        </div>
        <FooterCheckout />
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    status: state.Cart.status,
    compName: state.Cart.compName
  };
}

export default connect(mapStatesToProps, { clearCheckoutSteps })(Checkout);