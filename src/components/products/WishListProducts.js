import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProductsSlider from './ProductsSlider';
import {fetchWishList} from '../../actions/products';

class WishListProducts extends Component {

  constructor(props){
    super(props);
    this.state = {
      products: props.wishlist,
      status: props.status
    };
  }

  componentWillMount(){
    this.props.fetchWishList();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'wishlist' && nextProps.status != this.state.status){
      this.setState({
        products: nextProps.wishlist,
        status: nextProps.status
      });
    }
  }

  render() {

    const {products} = this.state;

    if(!products.length)
      return null;

    return (
        <div className="product-similar">
            <div className="heading-block">
               <div className="container">
                  <h2 data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate">Your Wishlist ({products.length} items)</h2>
                  <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
               </div>
            </div>
            <ProductsSlider showMeta={true} products={products} wishlist={true} />
        </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    wishlist: [...state.Customer.wishlist],
    status: state.Customer.status,
    compName: state.Customer.compName
  };
}

export default connect(mapStatesToProps, {fetchWishList})(WishListProducts);
