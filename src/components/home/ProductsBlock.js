import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProductsGridView from '../ProductsGridView';
import {fetchCategoryIdBySlug, fetchProductsByCategoryId} from '../../actions/products';
import {storeProductBlocksInMemory} from '../../actions/home';

class ProductsBlock extends Component {

    constructor(props){
        super(props);

        this.state = {
            products: props.products,
            category: props.category,
            name: props.name,
            description: props.description,
            moreProducts: typeof props.moreProducts !== 'undefined' ? props.moreProducts : false
        };

        this._unMounted = false;
        //this.fetchProductsList = this.fetchProductsList.bind(this);
    }

    // componentWillMount(){
    //     const {category} = this.props;
    //     if(category === null)
    //         return null;
    //     // Fetch category Id from slug
    //     this.fetchProductsList();
    // }

    // fetchProductsList(){
    //     const {category, products, limit, page, index} = this.state;

    //     fetchProductsByCategoryId(category, page, limit).then(response => {
    //         if(!this._unMounted){
    //             this.setState({
    //               products: response.data,
    //               page: parseInt(page) + 1
    //             });

    //             this.props.storeProductBlocksInMemory(response.data, index);
    //         }
    //     });
    // }

    componentWillUnmount () {
        this._unMounted = true;
    }

    render() {
        const {products, category, name, description, moreProducts} = this.state;
        if(category === null)
            return null;

        return (
            <div className="block-product-ui">
                <div className="heading-block">
                    <div className="container">
                        <h2 data-aos="fade-up" data-aos-delay="100">{name}</h2>
                        <p data-aos="fade-up" data-aos-delay="200">{description}</p>
                        <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
                    </div>
                </div>
                <ProductsGridView moreProducts={moreProducts} col={3} products={products} category={category} customClass="m-b0" />
            </div>
    );
  }
}


export default ProductsBlock;
