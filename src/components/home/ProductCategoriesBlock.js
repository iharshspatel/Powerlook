import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {MEDIA_BASE} from '../../constants';

class ProductCategoriesBlock extends Component {

    render() {
        const {categories} = this.props;

        if(!categories.length)
            return null;

        return (
            <div className="block-ad-ui">
                <div className="heading-block">
                    <div className="container">
                        <h2 data-aos="fade-up" data-aos-delay="100">Explore Products</h2>
                        <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
                    </div>
                </div>
                <div className="grid-product layout-ads layout-1 all-product">
                    <div className="container">
                        <div className="row">
                            {
                                categories.map(item => {
                                    return typeof item.id !== 'undefined' ? <div className="col-sm-2" data-aos="fade-up" key={item.id}>
                                            <Link to={`/product-category/${item.urlkey}`}>
                                               <div className="catgories-block">
                                                  <figure>
                                                     <img src={`${MEDIA_BASE}/catalog/category/${item.image}`} alt={item.name} />
                                                  </figure>
                                                  <figcaption>{item.name}</figcaption>
                                               </div>
                                            </Link>
                                         </div> : ''
                                })
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
    );
  }
}

export default ProductCategoriesBlock;
