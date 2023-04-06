import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';

class OrderListItemProductSkeleton extends Component {

  render() {
    const {count} = this.props;
    const items = new Array(count).fill(0);

    return (
        <>
        {
          items.map((item, index) => {
            return <div key={index} className="block-sec-product">
                             <figure>
                                <Skeleton width={66} height={66} />
                             </figure>
                             <figcaption>
                                <Skeleton width={340} height={20} />
                                <div style={{marginTop: '5px'}} className="all-product-disc"><Skeleton width={200} height={12} /></div>
                             </figcaption>
                          </div>
          })
        }
        </>
    );
  }
}

export default OrderListItemProductSkeleton;
