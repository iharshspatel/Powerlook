import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import {Link} from 'react-router-dom';
import {MEDIA_BASE} from '../../constants';

class BannerLayout7 extends Component {

    render() {
        const {images} = this.props;

        return (
            <div className="grid-product layout-ads layout-6">
                <div className="container">
                    {
                        !images.length
                        ?
                        <div className="row">
                            <div className="col-sm-6">
                                <Skeleton width={570} height={653} />
                            </div>
                            <div className="col-sm-6">
                                <div className="row">
                                   <div className="col-sm-12">
                                      <Skeleton width={570} height={311} />
                                   </div>
                                   <div className="col-sm-12">
                                      <Skeleton width={570} height={311} />
                                   </div>
                                </div>
                             </div>
                        </div>
                        :
                        <div className="row">
                            {
                                typeof images[0] !== 'undefined'
                                &&
                                <div className="col-sm-6">
                                    {
                                      images[0].imagelink && images[0].imagelink.match(/^http/)
                                      ?
                                      <a href={images[0].imagelink}>
                                          <img src={`${MEDIA_BASE}/${images[0].imageurl}`} alt={images[0].title} />
                                      </a>
                                      :
                                      <Link to={images[0].imagelink}>
                                          <img src={`${MEDIA_BASE}/${images[0].imageurl}`} alt={images[0].title} />
                                      </Link>
                                    }
                                 </div>
                            }
                             <div className="col-sm-6">
                                <div className="row">
                                   {
                                    typeof images[1] !== 'undefined'
                                    &&
                                    <div className="col-sm-12">
                                        {
                                          images[1].imagelink && images[1].imagelink.match(/^http/)
                                          ?
                                          <a href={images[1].imagelink}>
                                              <img src={`${MEDIA_BASE}/${images[1].imageurl}`} alt={images[1].title} />
                                          </a>
                                          :
                                          <Link to={images[1].imagelink}>
                                              <img src={`${MEDIA_BASE}/${images[1].imageurl}`} alt={images[1].title} />
                                          </Link>
                                        }
                                    </div>
                                   }
                                   {
                                    typeof images[2] !== 'undefined'
                                    &&
                                    <div className="col-sm-12">
                                      {
                                        images[2].imagelink && images[2].imagelink.match(/^http/)
                                        ?
                                        <a href={images[2].imagelink}>
                                            <img src={`${MEDIA_BASE}/${images[2].imageurl}`} alt={images[2].title} />
                                        </a>
                                        :
                                        <Link to={images[2].imagelink}>
                                            <img src={`${MEDIA_BASE}/${images[2].imageurl}`} alt={images[2].title} />
                                        </Link>
                                      }
                                    </div>
                                   }
                                </div>
                             </div>
                        </div>
                    }
                </div>
            </div>
        );
  }
}

export default BannerLayout7;
