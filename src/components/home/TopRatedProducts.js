import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProductsGridView from '../ProductsGridView';
import {fetchTopRatedProducts} from '../../actions/products';
import {storeTopRatedProductsInMemory} from '../../actions/home';

class TopRatedProducts extends Component {

    constructor(props){
        super(props);

        this.state = {
            products: props.products
        };

        this._unMounted = false;
    }

    // componentWillMount(){
    //     fetchTopRatedProducts().then(response => {
    //         if(!this._unMounted){
    //             this.setState({
    //               products: response.data
    //             });
    //             this.props.storeTopRatedProductsInMemory(response.data);
    //         }
    //     });
    // }

    componentWillUnmount () {
        this._unMounted = true;
    }

    render() {
        const {products} = this.state;

        if(products === null || !products.length)
            return null;

        return (
            <div className="block-product-ui">
                <div className="heading-block">
                    <div className="container">
                        <h2 data-aos="fade-up" data-aos-delay="100">Top Rated Products</h2>
                        <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
                    </div>
                </div>
                <ProductsGridView col={3} products={products} />
            </div>
    );
  }
}

export default TopRatedProducts;