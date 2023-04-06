import React, { Component } from 'react';
import {loadScript} from '../../utilities';
import ProductItemCard from './ProductItemCard';
import '../../jquery.bxslider.js';

class ProductsSlider extends Component {

    constructor(props){
        super(props);

        this.loadSlider = this.loadSlider.bind(this);
        this.slider = null;
        this.config = {
          minSlides: 1,
          maxSlides: 5,
          slideWidth: 270,
          slideMargin: 30,
          moveSlides: 1,
          nextText: '',
          prevText: '',
        };
    }

    componentDidMount(){
        window.addEventListener('load', this.loadSlider);

        if(document.readyState === "complete" || document.readyState === "interactive"){
          this.loadSlider();
        }
    }

    componentDidUpdate(){
      const $ = window.$$;
      if ($(window).width() > 1025) {
        this.slider.reloadSlider(this.config);
      }
    }

    loadSlider(){
        const $ = window.$$;

        if ($(window).width() > 1025) {
            this.slider = $(this.refs.productSlider).bxSlider(this.config);
        }
    }


  render() {
    const showMeta = typeof this.props.showMeta !== 'undefined' ? this.props.showMeta : true;
    const isWishlist = typeof this.props.wishlist !== 'undefined' ? this.props.wishlist : false;
    const products = this.props.products;

    return (
        <div className="container">
           <div className="slider-product">
              <ul className="bxslider-product simlar-products" ref="productSlider">
                {
                  !isWishlist
                  ?
                  products.map((item, index) => {
                    item.price = item.type_id == 'configurable' ? item.min_price : item.price;
                    return <li className="col-sm-4" data-aos="fade-up" key={index}>
                      <ProductItemCard {...item} meta={showMeta} />
                    </li>
                  })
                  :
                  products.map((item) => {
                    item.product.price = item.product.type_id == 'configurable' ? item.product.min_price : item.product.price;
                    return <li className="col-sm-4" data-aos="fade-up" key={item.wishlist_item_id}>
                      <ProductItemCard {...item.product} meta={showMeta} productId={item.product_id} wishlistItemId={item.wishlist_item_id} />
                    </li>
                  })
                }
              </ul>
           </div>
        </div>
    );
  }
}

export default ProductsSlider;
