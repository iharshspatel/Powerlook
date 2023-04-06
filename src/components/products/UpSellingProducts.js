import React, { Component } from 'react';
//import ProductsSlider from './ProductsSlider';
import ProductsGridView from '../ProductsGridView';
import {fetchUpSellingProduct} from '../../actions/products';

class UpSellingProducts extends Component {

  constructor(props){
    super(props);
    this.state = {
      products: props.products
    };
  }

  // componentWillMount(){
  //   fetchUpSellingProduct(this.props.sku).then(response => {
  //     this.setState({
  //       products: response.data
  //     });
  //   });
  // }

  render() {

    const {products} = this.state;

    if(!products.length)
      return null;

    return (
        <div className="product-similar">
            <div className="heading-block">
               <div className="container">
                  <h2 data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate">You May Also Like</h2>
                  <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
               </div>
            </div>
            <ProductsGridView products={products} col={3} />
            {/*<ProductsSlider showMeta={true} products={products} />*/}
        </div>
    );
  }
}

export default UpSellingProducts;
