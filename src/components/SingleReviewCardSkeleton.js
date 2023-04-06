import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';

class SingleReviewCardSkeleton extends Component {

    render() {
        const {count} = this.props;
        const items = new Array(count).fill(0);

        return (
          <>
            {
                items.map((item, index) => {
                    return <div className="col-sm-3" key={index}>
                                <div className="review-ui">
                                    <a href="javascript:void(0);">
                                        <figure>
                                            <Skeleton width={255} height={189} />
                                        </figure>
                                        <figcaption>
                                            <h2><Skeleton width={120} height={20} /></h2>
                                            <p>
                                                <Skeleton count={3} />
                                            </p>
                                        </figcaption>
                                    </a>
                                </div>
                            </div>
                })
            }
          </>
        );
    }
}

export default SingleReviewCardSkeleton;
