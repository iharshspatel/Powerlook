import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class OtherLinkedProductsSlider extends Component {

  constructor(props) {
    super(props);

    this.loadSlider = this.loadSlider.bind(this);
    this.slider = null;
    const $ = window.$$;
    this.config = {
      infiniteLoop: false,
      hideControlOnEnd: true,
      minSlides: 1,
      maxSlides: 5,
      slideWidth: 270,
      slideMargin: 30,
      moveSlides: 1,
      nextText: '',
      prevText: '',
    };
  }

  componentDidMount() {
    window.addEventListener('load', this.loadSlider);

    if (document.readyState === "complete" || document.readyState === "interactive") {
      this.loadSlider();
    }
  }

  componentDidUpdate() {
    const $ = window.$$;
    if ($(window).width() > 1025) {
      this.slider.reloadSlider(this.config);
    }
  }

  loadSlider() {
    const $ = window.$$;

    if ($(window).width() > 1025) {
      this.slider = $(this.refs.productSlider).bxSlider(this.config);
    }
  }


  render() {
    let { products } = this.props;
    if (!products.length)
      return null;

    return (
      <div className="product-similar">
        <div className="heading-block">
          <div className="container">
            <h2 data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate">More Colours</h2>
            <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
          </div>
        </div>
        <div className="slider-product">
          <ul className="bxslider-product simlar-products other-color-slider" ref="productSlider">
            {
              products.map((product, index) => {
                return (
                  <li className="col-sm-4" data-aos="fade-up" key={index}>
                    <Link to={`/shop/${product.category}/${product.url_key}`}>
                      <img src={product.thumbnail} alt={product.sku} />
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default OtherLinkedProductsSlider;
