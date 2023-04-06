import React, { Component } from 'react';
import RmaListItem from './RmaListItem';
import {fetchRmasList} from '../../actions/rma';
import OrderListItemSkeleton from  '../customer/OrderListItemSkeleton';

class RmaList extends Component {
  constructor(props){
    super(props);
    this.state = {
      orders: null
    };
  }

  componentWillMount(){
    fetchRmasList().then(response => {
      this.setState({
        orders: response.data
      });
    });
  }

  render() {
    const {orders} = this.state;

    return (
        <div className="block-order-container">
          <div className="head-tabs">
             <h2>Returns / Exchange status</h2>
          </div>
          <div className="block-order-container-list">
            {
              orders !== null && orders.length > 0
              ?
              orders.map(order => {
                return <RmaListItem key={order.entity_id} order={order} type="rma" />
              })
              :
              orders === null
              ?
              <OrderListItemSkeleton count={2} />
              :
              <div className="no-record">No record found!</div>
            }
          </div>
       </div>
    );
  }
}

export default RmaList;
