import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';

class ProductsSideFilterSkeleton extends Component {

    render() {
        const {count} = this.props;
        const items = new Array(count).fill(0);

        return (
          <>
            {
                items.map((item, index) => {
                    return <div key={index} className="filter-list-block">
                              <div className="head-list-block">
                                 <h3><Skeleton width={100} height={13} /></h3>
                              </div>
                              <div className="block-ui">
                                 <ul>
                                    <li className="custom-radio-ui"><Skeleton width={200} height={19} /></li>
                                    <li className="custom-radio-ui"><Skeleton width={200} height={19} /></li>
                                    <li className="custom-radio-ui"><Skeleton width={200} height={19} /></li>
                                 </ul>
                              </div>
                           </div>
                })
            }
          </>
        );
    }
}

export default ProductsSideFilterSkeleton;
