import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {dateFormat} from '../../utilities';
import {RMASTATUS} from '../../constants';
import OrderListItemProduct from '../customer/OrderListItemProduct';

class RmaListItem extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const {order} = this.props;

    return (
        <div className="block-list-order-v">
          <div className="head-block-order return-exchange-head">
             <div className="order-type order-head-devide">
                <label style={{color: RMASTATUS[order.resolution_type][order.admin_status].color}}>{RMASTATUS[order.resolution_type][order.admin_status].label}</label>
                <p dangerouslySetInnerHTML={{__html: order.state}}></p>
             </div>
             <div className="order-id-block order-head-devide">
                <label>Order #{order.increment_id}</label>
                <p>Placed on {dateFormat(order.created_at, 'DD MMM, YYYY')}</p>
             </div>
          </div>
          <div className="block-product-detail">
             <div className="product-in-list-v">
                <div className="row">
                   <div className="col-sm-8 align-self-center">
                      {
                        order.items.map(item => {
                            return <OrderListItemProduct item={item} key={item.item_id} />
                        })
                      }
                      
                   </div>
                   <div className="col-sm-4 align-self-center">
                      <div className="btn-block-product text-right">
                         <Link to={`/account/rma/detail/${order.rma_id}`} className="border-btn-arrow">View Details</Link>
                      </div>
                   </div>
                </div>
                
             </div>
          </div>
       </div>
    );
  }
}

export default RmaListItem;
