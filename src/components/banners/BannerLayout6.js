import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import {Link} from 'react-router-dom';
import {MEDIA_BASE} from '../../constants';

class BannerLayout6 extends Component {

    render() {
        const {images} = this.props;

        return (
            <div className="grid-product layout-ads layout-6">
                <div className="container">
                    {
                        !images.length
                        ?
                        <div className="row">
                            <div className="col-sm-12">
                                <Skeleton width="100%" height={300} />
                            </div>
                        </div>
                        :
                        <div className="row">
                            <div className="col-sm-12">
                                {
                                  images[0].imagelink && images[0].imagelink.match(/^http/)
                                  ?
                                  <a href={images[0].imagelink} >
                                      <img src={`${MEDIA_BASE}/${images[0].imageurl}`} alt={images[0].title} />
                                  </a>
                                  :
                                  <Link to={images[0].imagelink}>
                                      <img src={`${MEDIA_BASE}/${images[0].imageurl}`} alt={images[0].title} />
                                  </Link>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
  }
}

export default BannerLayout6;
