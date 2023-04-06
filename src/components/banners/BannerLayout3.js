import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import {Link} from 'react-router-dom';
import {MEDIA_BASE} from '../../constants';

class BannerLayout3 extends Component {

    render() {
        const {images , webEngageCallback} = this.props;

        return (
            <div className="grid-product layout-ads layout-3">
                <div className="container">
                    {
                        !images.length
                        ?
                        <div className="row">
                            <div className="col-sm-4" data-aos="fade-up">
                                <Skeleton width={370} height={287} />
                            </div>
                            <div className="col-sm-4" data-aos="fade-up">
                                <Skeleton width={370} height={287} />
                            </div>
                            <div className="col-sm-4" data-aos="fade-up">
                                <Skeleton width={370} height={287} />
                            </div>
                        </div>
                        :
                        <div className="row">
                           {
                              images.map(item => {
                                return <div className="col-sm-4"  data-aos="fade-up" key={item.entity_id}>
                                          {
                                            item.imagelink && item.imagelink.match(/^http/)
                                            ?
                                            <a href={item.imagelink} onClick={() => webEngageCallback(item)}>
                                                <img src={`${MEDIA_BASE}/${item.imageurl}`} alt={item.title} />
                                            </a>
                                            :
                                            <Link to={item.imagelink} onClick={() => webEngageCallback(item)}>
                                                <img src={`${MEDIA_BASE}/${item.imageurl}`} alt={item.title} />
                                            </Link>
                                          }
                                       </div>
                              })
                           } 
                           
                        </div>
                    }
                </div>
            </div>
        );
  }
}

export default BannerLayout3;
