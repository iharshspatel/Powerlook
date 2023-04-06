import React, { Component } from 'react';
import {isMobile} from '../../utilities';

class FeaturesBlock extends Component {

    render() {
        return (
            <div className="features-block">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="feature-ui-card">
                                <figure>
                                    <span className="icon-quality"></span>
                                </figure>
                                <figcaption>
                                    {
                                        isMobile()
                                        ?
                                        <label>Premium Quality Products</label>
                                        :
                                        <label>Premium Quality</label>
                                    }
                                    
                                    <p>All the clothing products are made from 100% premium quality fabric.</p>
                                </figcaption>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-ui-card p-l48">
                                <figure>
                                    <span className="icon-secure"></span>
                                </figure>
                                <figcaption>
                                    <label>Secure Payments</label>
                                    <p>Highly Secured SSL-Protected Payment Gateway.</p>
                                </figcaption>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-ui-card p-l48">
                                <figure>
                                    <span className="icon-return"></span>
                                </figure>
                                <figcaption>
                                    {
                                        isMobile()
                                        ?
                                        <label>7 Days Return Policy</label>
                                        :
                                        <label>7 Days Return</label>
                                    }
                                    
                                    <p>Return or exchange the orders within 7 days of delivery.</p>
                                </figcaption>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
  }
}

export default FeaturesBlock;
