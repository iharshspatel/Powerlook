import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import { withRouter } from "react-router";
import {getCart} from '../../actions/cart';
import {currencyFormat} from '../../utilities';

class MobileGrandTotalBar extends Component {

  constructor(props){
      super(props);

      this.state = {
          totals: typeof props.cart.total_segments !== 'undefined' ? props.cart.total_segments : {},
          status: props.status,
          checkoutStatus: props.checkoutStatus,
          CODFee: props.CODFee
      };
  }

  componentWillMount(){
      const {cart} = this.props;
      if(typeof cart.items === 'undefined'){
          // If there is no cart in memory
          this.props.getCart();
      }
  }

  componentWillReceiveProps(nextProps){
    let codfee = 0;
    if(nextProps.CODFee > 0){
      codfee = nextProps.CODFee;
    }
    if(nextProps.compName == 'cart' && this.state.status != nextProps.status){
        this.setState({
            totals: typeof nextProps.cart.total_segments !== 'undefined' ? {...nextProps.cart.total_segments, codfee} : {},
            status: nextProps.status
        });
    }else{
      if(nextProps.checkoutCompName == 'wallet-calc' && this.state.checkoutStatus != nextProps.checkoutStatus){
          this.setState({
              totals: {...nextProps.walletCalc, codfee},
              checkoutStatus: nextProps.checkoutStatus
          });
      }
    }
    
    if(nextProps.CODFee != this.state.CODFee){
        this.setState({
            totals: {...this.state.totals, codfee},
            CODFee: nextProps.CODFee
        });
    }
  }

  render() {
    const {totals} = this.state;
    const codfee = typeof totals.codfee !== 'undefined' && totals.codfee > 0 ? totals.codfee : 0;
    return (
      <>
      {
        Object.keys(totals).length > 0 && typeof totals.grand_total !== 'undefined' 
        &&
        <div className="total-mob"><span>{totals.grand_total.title}</span>{currencyFormat(totals.grand_total.value + codfee, 'INR')}</div>
      }
      </>
    );
  }
}

const mapStatesToProps = (state) => {
    return {
        cart: {...state.Cart.cart},
        walletCalc: {...state.Checkout.walletCalc},
        CODFee: state.Checkout.CODFee,
        checkoutStatus: state.Checkout.status,
        checkoutCompName: state.Checkout.compName,
        status: state.Cart.status,
        compName: state.Cart.compName
    };
}

export default withRouter(connect(mapStatesToProps, {getCart})(MobileGrandTotalBar));