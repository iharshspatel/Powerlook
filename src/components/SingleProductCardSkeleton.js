import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';

class SingleProductCardSkeleton extends Component {

    render() {
        const {count, col} = this.props;
        const items = new Array(count).fill(0);
        const dims = {'4': {width: 289, height: 360}, '3': {width: 255, height: 328}}
        return (
          <>
            {
                items.map((item, index) => {
                    return <div className={`col-sm-${col}`} key={index}>
                                <div className="product-ui-card">
                                    <div className="product-item">
                                        <figure>
                                            <Skeleton width={dims[col].width} height={dims[col].height} />
                                        </figure>
                                        <figcaption>
                                            <a href="javascript:void(0);">
                                                <span className="catagries-name"><Skeleton width={70} /></span>
                                                <h4><Skeleton width={210} height={20} /></h4>
                                                <div className="price"><Skeleton width={50} /></div>
                                            </a>
                                        </figcaption>
                                    </div>
                                </div>
                            </div>
                })
            }
          </>
        );
    }
}

export default SingleProductCardSkeleton;
