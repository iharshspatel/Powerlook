import React, { Component } from 'react';
import moment from 'moment';
import {connect} from 'react-redux'; 
import OrderSummaryBagItem from './OrderSummaryBagItem';
import {fetchShippingInformation} from '../../actions/checkout';

class OrderSummaryBag extends Component {

  constructor(props){
      super(props);
      this.state = {
        cart: props.cart,
        status: props.status
      };
  }

  componentWillMount(){
    const {shippingAddress, shippingMethod} = this.props;
    this.props.fetchShippingInformation(shippingAddress, shippingMethod);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'cart' && this.state.status != nextProps.status){
        this.setState({
            cart: nextProps.cart,
            status: nextProps.status
        });
    }
  }

  render() {
    const {cart} = this.state;
    const {availability} = this.props;

    return (
        <div className="block-content-item-container">
          {
            typeof availability !== 'undefined' && availability != '' && !isNaN(availability)
            &&
            <div className="estimated-delivery-days">
              Estimated delivery by <span>{availability > 2 ? moment().add('days', availability).format('dddd, LL') : moment().add('days', availability).calendar()}</span>
            </div>
          }
          
          {
            cart.items_qty > 0
            &&
            cart.items.map(item => {
              return <OrderSummaryBagItem key={item.item_id} item={item} />
            })
          }
       </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    shippingAddress: state.Checkout.progress.shippingAddress,
    shippingMethod: state.Checkout.progress.shippingMethod,
    availability: state.Customer.availability,
    cart: {...state.Cart.cart},
    status: state.Cart.status,
    compName: state.Cart.compName
  }
}

export default connect(mapStatesToProps, {fetchShippingInformation})(OrderSummaryBag);