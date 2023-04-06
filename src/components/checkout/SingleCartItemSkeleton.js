import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';

class SingleCartItemSkeleton extends Component {

    render() {
        const {count} = this.props;
        const items = new Array(count).fill(0);

        return (
          <>
            {
                items.map((item, index) => {
                    return <div className="item-base-item" key={index}>
                             <div className="itemContainer-base-itemLeft">
                                <Skeleton width={136} height={179} />
                             </div>
                             <div className="itemContainer-base-itemRight">
                                <div className="itemContainer-base-details">
                                   <div className="itemContainer-base-itemName">
                                      <Skeleton width={460} height={19} />
                                   </div>
                                   <div className="itemContainer-base-itemName">
                                      <Skeleton width={300} height={19} />
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

export default SingleCartItemSkeleton;
