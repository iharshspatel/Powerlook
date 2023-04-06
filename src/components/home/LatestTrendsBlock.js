import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';

class LatestTrendsBlock extends Component {

    render() {
        return (
           <div className="block-ad-ui">
                <div className="heading-block">
                    <div className="container">
                        <h2>Our Lookbook</h2>
                        <p>Explore our latest editorial</p>
                        <div className="head-line"></div>
                    </div>
                </div>
                <div className="grid-product layout-ads layout-2">
                    <div className="container">
                        {
                            true
                            ?
                            <div className="row">
                                <div className="col-sm-6">
                                    <Skeleton width={540} height={618} />
                                </div>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <Skeleton width={255} height={293} />
                                        </div>
                                        <div className="col-sm-6">
                                            <Skeleton width={255} height={293} />
                                        </div>
                                        <div className="col-sm-6">
                                            <Skeleton width={255} height={293} />
                                        </div>
                                        <div className="col-sm-6">
                                            <Skeleton width={255} height={293} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="row">
                                <div className="col-sm-6">
                                    <a href="javascript:void(0);">
                                        <img src="/assets/images/look-1.png" alt="" />
                                    </a>
                                </div>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <a href="javascript:void(0);">
                                                <img src="/assets/images/look-2.png" alt="" />
                                            </a>
                                        </div>
                                        <div className="col-sm-6">
                                            <a href="javascript:void(0);">
                                                <img src="/assets/images/look-3.png" alt="" />
                                            </a>
                                        </div>
                                        <div className="col-sm-6">
                                            <a href="javascript:void(0);">
                                                <img src="/assets/images/look-4.png" alt="" />
                                            </a>
                                        </div>
                                        <div className="col-sm-6">
                                            <a href="javascript:void(0);">
                                                <img src="/assets/images/look-5.png" alt="" />
                                            </a>
                                        </div>
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

export default LatestTrendsBlock;
