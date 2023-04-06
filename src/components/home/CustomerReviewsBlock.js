import React, { Component } from 'react';
import SingleReviewCardSkeleton from '../SingleReviewCardSkeleton';

class CustomerReviewsBlock extends Component {

    render() {
        return (
           <div className="customer-reviews">
                <div className="heading-block">
                    <div className="container">
                        <h2>Customer Reviews</h2>
                        <div className="head-line"></div>
                    </div>
                </div>
                <div className="reviews-content-block">
                    <div className="container">
                        {
                            true
                            ?
                            <div className="row">
                                <SingleReviewCardSkeleton count={4} />
                            </div>
                            :
                            <div className="row">
                                <div className="col-sm-3">
                                    <div className="review-ui">
                                        <a href="javascript:void(0);">
                                            <figure>
                                                <img src="/assets/images/review-img-1.png" alt="" />
                                            </figure>
                                            <figcaption>
                                                <div className="rating">
                                                    <i className="icon-star"></i>
                                                    <span>4.8</span>
                                                </div>
                                                <h2>Brian Henry</h2>
                                                <p>In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam volutpat aliquam.</p>
                                                <span className="link-btn">+ Show Product</span>
                                            </figcaption>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="review-ui">
                                        <a href="javascript:void(0);">
                                            <figure>
                                                <img src="/assets/images/review-img-2.png" alt="" />
                                            </figure>
                                            <figcaption>
                                                <div className="rating">
                                                    <i className="icon-star"></i>
                                                    <span>4.0</span>
                                                </div>
                                                <h2>Randy Ramos</h2>
                                                <p>Nam porttitor blandit accumsan. Ut vel dictum sem, a pretium dui. In malesuada enim.</p>
                                                <span className="link-btn">+ Show Product</span>
                                            </figcaption>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="review-ui">
                                        <a href="javascript:void(0);">
                                            <figure>
                                                <img src="/assets/images/review-img-3.png" alt="" />
                                            </figure>
                                            <figcaption>
                                                <div className="rating">
                                                    <i className="icon-star"></i>
                                                    <span>4.1</span>
                                                </div>
                                                <h2>Eugene Davidson</h2>
                                                <p>Fusce vehicula dolor arcu, sit amet blandit dolor mollis nec. Donec viverra eleifend.</p>
                                                <span className="link-btn">+ Show Product</span>
                                            </figcaption>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="review-ui">
                                        <a href="javascript:void(0);">
                                            <figure>
                                                <img src="/assets/images/review-img-4.png" alt="" />
                                            </figure>
                                            <figcaption>
                                                <div className="rating">
                                                    <i className="icon-star"></i>
                                                    <span>4.2</span>
                                                </div>
                                                <h2>Raymond Lane</h2>
                                                <p>Vestibulum rutrum quam vitae fringilla tincidunt. Suspendisse nec tortor urna. Ut.</p>
                                                <span className="link-btn">+ Show Product</span>
                                            </figcaption>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
    );
  }
}

export default CustomerReviewsBlock;
