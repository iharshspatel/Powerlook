import React, { Component } from 'react';

class ShoppingBagProductSlidersBlock extends Component {
  render() {
    return (
      <>
        <div className="product-similar">
              <div className="heading-block">
                 <div className="container">
                    <h2 data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate">Similar Products</h2>
                    <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
                 </div>
              </div>
              {/*<ProductsSlider />*/}
          </div>
          <div className="product-similar">
              <div className="heading-block">
                 <div className="container">
                    <h2 data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate">You May Also Like</h2>
                    <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
                 </div>
              </div>
              {/*<ProductsSlider />*/}
          </div>
      </>
    );
  }
}

export default ShoppingBagProductSlidersBlock;