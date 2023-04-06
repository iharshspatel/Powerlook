import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import OrderListItemProductSkeleton from './OrderListItemProductSkeleton'; 

class OrderListItemSkeleton extends Component {

  render() {
    const {count} = this.props;
    const items = new Array(count).fill(0);

    return (
        <>
        {
          items.map((item, index) => {
            return <div key={index} className="block-list-order-v">
              <div className="head-block-order">
                 <div className="order-type order-head-devide">
                    <label><Skeleton width={66} height={19} /></label>
                    <p><Skeleton width={100} height={16} /></p>
                 </div>
                 <div className="info-order order-head-devide">
                    <label><Skeleton width={50} height={15} /></label>
                    <p><Skeleton width={50} height={16} /></p>
                 </div>
                 <div className="info-order quantity-head order-head-devide">
                    <label><Skeleton width={50} height={15} /></label>
                    <p><Skeleton width={20} height={16} /></p>
                 </div>
                 <div className="order-id-block order-head-devide">
                    <label><Skeleton width={100} height={16} /></label>
                    <p><Skeleton width={80} height={16} /></p>
                 </div>
              </div>
              <div className="block-product-detail">
                 <div className="product-in-list-v">
                    <div className="row">
                       <div className="col-sm-8 align-self-center">
                          <OrderListItemProductSkeleton count={1} />
                       </div>
                    </div>
                    
                 </div>
              </div>
            </div>
          })
        }
        </>
    );
  }
}

export default OrderListItemSkeleton;
