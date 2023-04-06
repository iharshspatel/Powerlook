import React, { Component } from 'react';
import ScrollUpButton from "react-scroll-up-button";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductListSideFilters from './products/ProductListSideFilters';
import ProductsGridViewTopBar from './products/ProductsGridViewTopBar';
import ProductsGridView from './ProductsGridView';
import EmptyCategoryProductsBlock from './EmptyCategoryProductsBlock';
import MobileCatalogSortOptions from './MobileCatalogSortOptions';
import Header from './Header';
import Footer from './Footer';
import { catalogSearch } from '../actions/products';
import { isMobile, trackwebEngageEvent } from '../utilities';
import {PRODUCT_SEARCHED} from '../constants';
class CatalogSearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: null,
      currentPage: 1,
      limit: 20,
      hasMore: true,
      filters: {}
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

    this.fetchCatalogSearchResults(null, filters);
  }

  componentWillUnmount() {
    this._unMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const searchParams = new URLSearchParams(nextProps.location.search);
      let filters = {};
      for (var pair of searchParams.entries()) {
        filters = { ...filters, [pair[0]]: pair[1] };
      }

      this.fetchCatalogSearchResults(null, filters);
    }
  }

  fetchCatalogSearchResults(catId, filters = {}, pagination = null, currentPage = 1) {
    const { limit } = this.state;
    pagination = typeof pagination !== 'undefined' && pagination === true;
    if (typeof filters !== 'undefined') {
      !pagination && !this._unMounted && this.setState({
        products: null,
        filters
      });
    }
    !this._unMounted && catalogSearch(currentPage, limit, filters).then(response => {
      !this._unMounted && this.setState({
        products: pagination && this.state.products !== null ? [...this.state.products, ...response.data] : response.data,
        filters,
        hasMore: response.data.length >= limit,
        currentPage: currentPage + 1
      });
      if(filters.searchTerm !== "undefined" && filters.searchTerm !== null){
        trackwebEngageEvent(PRODUCT_SEARCHED , { "Search Keyword" : filters.searchTerm , "Item Count" : this.state.products.length});
       
      }
    });
  }

  showMobileFilter(e) {
    e.preventDefault();
    const $ = window.$$;
    $('.aside-filter').addClass('filteractive');
    $('body').addClass('freezbody');
  }

  showSortOptions(e) {
    e.preventDefault();
    const $ = window.$$;
    $('.modal-bottom').addClass('sortactive');
    $('body').addClass('freezbody');
  }

  render() {
    const { products, filters, hasMore, currentPage } = this.state;
    const options = { latest: "Latest", rating: "Rating", price_desc: "Price: High to Low", price_asc: "Price: Low to High" };
    return (
      <div className="main-wrapper">
        <Header />
        {
          products !== null && products.length == 0
            ?
            <EmptyCategoryProductsBlock />
            :
            <>
              <div className="block-listing catalog-list">
                <div className="container">
                  <div className="row">
                    <ProductListSideFilters catalogSearch={true} filters={filters} fetchProductsByCategoryId={this.fetchCatalogSearchResults} />
                    <div className="col-sm-12 col-md-9 right-block-listing">
                      <ProductsGridViewTopBar options={options} searchTerm={filters.searchTerm} products={products} />
                      <InfiniteScroll
                        dataLength={products === null || typeof products === 'undefined' ? 0 : products.length}
                        next={() => this.fetchCatalogSearchResults(null, filters, true, currentPage)}
                        hasMore={hasMore}
                        loader={<div style={{ textAlign: 'center', paddingBottom: '100px' }}><img width="40" src="/assets/images/spinner.svg" alt="Loading..." /></div>}
                      >
                        <ProductsGridView col={4} pagination={true} products={products} category={''} />
                      </InfiniteScroll>
                    </div>
                  </div>
                </div>
              </div>
              <MobileCatalogSortOptions options={options} />
              <div className="mob-filter">
                <button className="blockinnerfilter sort-mob-btn" onClick={this.showSortOptions}>
                  <i className="icon-sorting"></i>
                  <span>Sort</span>
                </button>
                <button className="blockinnerfilter filter-mob-btn" onClick={this.showMobileFilter}>
                  <i className="icon-filter"></i>
                  <span>Filter</span>
                </button>
              </div>
            </>
        }
        <ScrollUpButton style={{ width: 30, height: 30 }} ToggledStyle={{ bottom: (isMobile() ? 55 : 30) }} />
        <Footer />
        {/* seoContent={meta_data} */}
      </div>
    );
  }
}

export default CatalogSearchResults;
