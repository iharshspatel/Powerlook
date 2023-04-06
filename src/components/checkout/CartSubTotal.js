import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import {currencyFormat} from '../../utilities';

class CartSubTotal extends Component {

  constructor(props){
      super(props);
      this.state = {
          total: props.cart.base_grand_total,
          status: props.status
      };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'cart' && this.state.status != nextProps.status){
        this.setState({
            total: nextProps.cart.base_grand_total,
            status: nextProps.status
        });
    }
  }

  render() {
    const {total} = this.state;

    return (
      <div className="total-main">
        Total: {currencyFormat(total, 'INR')}
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
    return {
        cart: {...state.Cart.cart},
        status: state.Cart.status,
        compName: state.Cart.compName
    };
}

export default connect(mapStatesToProps)(CartSubTotal);