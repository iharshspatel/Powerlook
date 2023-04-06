import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import {Link} from 'react-router-dom';
import {MEDIA_BASE} from '../../constants';

class BannerLayout4 extends Component {

    render() {
        const {images , webEngageCallback} = this.props;

        return (
            <div className="grid-product layout-ads layout-2">
                <div className="container">
                    {
                        !images.length
                        ?
                        <div className="row">
                           
                           <div className="col-sm-6" data-aos="fade-up">
                              <div className="row">
                                 <div className="col-sm-6" data-aos="fade-up">
                                    <Skeleton width={270} height={311} />
                                 </div>
                                 <div className="col-sm-6" data-aos="fade-up">
                                    <Skeleton width={270} height={311} />
                                 </div>
                                 <div className="col-sm-6" data-aos="fade-up">
                                    <Skeleton width={270} height={311} />
                                 </div>
                                 <div className="col-sm-6" data-aos="fade-up">
                                    <Skeleton width={270} height={311} />
                                 </div>
                              </div>
                           </div>
                           <div className="col-sm-6" data-aos="fade-up">
                              <Skeleton width={570} height={653} />
                           </div>
                           
                        </div>
                        :
                        <div className="row">
                           
                           <div className="col-sm-6">
                              <div className="row">
                                 {
                                    images.map((item, index) => {
                                      if(index > 3)
                                        return null;

                                      return <div className="col-sm-6" data-aos="fade-up" key={item.entity_id}>
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
                           </div>
                           {
                            typeof images[4] !== 'undefined'
                            &&
                            <div className="col-sm-6">
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
                           }
                        </div>
                    }
                </div>
            </div>
        );
  }
}

export default BannerLayout4;
