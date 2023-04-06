import React, { Component } from 'react';
import ScrollUpButton from "react-scroll-up-button";
//import InfiniteScroll from "react-infinite-scroll-component";
import FlashSaleSideFilters from './products/FlashSaleSideFilters';
//import ProductsGridViewTopBar from './products/ProductsGridViewTopBar';
//import ProductsGridView from './ProductsGridView';
import EmptyCategoryProductsBlock from './EmptyCategoryProductsBlock';
import FlashSaleProductsBlock from './home/FlashSaleProductsBlock';
import Header from './Header';
import Footer from './Footer';
import { flashSaleProducts } from '../actions/products';
import { isMobile } from '../utilities';

class FlashSale extends Component {
  constructor(props) {
    super(props);

    let id = 0;
    const { params } = props.match;
    if (params && params.id) {
      id = params.id;
    }

    this.state = {
      products: null,
      sale: {},
      currentPage: 1,
      limit: 20,
      hasMore: true,
      filters: {},
      id
    };

    this.fetchCatalogSearchResults = this.fetchCatalogSearchResults.bind(this);
    this._unMounted = false;
  }

  componentWillMount() {
    const searchParams = new URLSearchParams(this.props.location.search);
    let filters = {};
    for (var pair of searchParams.entries()) {
      filters = { ...filters, [pair[0]]: pair[1] };
    }

    this.fetchCatalogSearchResults(filters);
  }

  componentWillUnmount() {
    this._unMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    // if(nextProps.location.search !== this.props.location.search){
    //   const searchParams = new URLSearchParams(nextProps.location.search);
    //   let filters = {};
    //   for(var pair of searchParams.entries()) {
    //     filters = {...filters, [pair[0]]: pair[1]};
    //   }

    //   this.fetchCatalogSearchResults(filters);
    // }
  }

  fetchCatalogSearchResults(filters = {}, pagination = null, currentPage = 1) {
    const { limit, id } = this.state;
    pagination = typeof pagination !== 'undefined' && pagination === true;
    if (typeof filters !== 'undefined') {
      !pagination && !this._unMounted && this.setState({
        products: null,
        filters
      });
    }
    !this._unMounted && flashSaleProducts(id, currentPage, limit, filters).then(response => {
      !this._unMounted && this.setState({
        products: pagination && this.state.products !== null ? [...this.state.products, ...response.data.products] : response.data.products,
        sale: response.data.sale,
        filters,
        hasMore: response.data.length >= limit,
        currentPage: currentPage + 1
      });
    });
  }

  render() {
    const { id, products, sale, filters, hasMore, currentPage } = this.state;
    const options = { latest: "Latest", rating: "Rating", price_desc: "Price: High to Low", price_asc: "Price: Low to High" };
    return (
      <div className="main-wrapper">
        <Header />
        {
          products !== null && products.length == 0
            ?
            <EmptyCategoryProductsBlock />
            :
            <div className="block-listing catalog-list">
              <div className="container">
                <div className="row">
                  <FlashSaleSideFilters id={id} catalogSearch={true} filters={filters} fetchProductsByCategoryId={this.fetchCatalogSearchResults} />
                  <div className="col-sm-12 col-md-9 right-block-listing">
                    {/*<ProductsGridViewTopBar options={options} searchTerm={filters.searchTerm} products={products} />*/}
                    <FlashSaleProductsBlock fullPage={false} sale={sale} products={products} />
                  </div>
                </div>
              </div>
            </div>
        }
        <ScrollUpButton style={{ width: 30, height: 30 }} ToggledStyle={{ bottom: (isMobile() ? 55 : 30) }} />
        <Footer />
        {/* seoContent={meta_data} */}
      </div>
    );
  }
}

export default FlashSale;
