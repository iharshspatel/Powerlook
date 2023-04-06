import React, { Component } from 'react';
import { connect } from 'react-redux';
import ScrollUpButton from "react-scroll-up-button";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductListSideFilters from './products/ProductListSideFilters';
import ProductsGridViewTopBar from './products/ProductsGridViewTopBar';
import ProductsGridView from './ProductsGridView';
import EmptyCategoryProductsBlock from './EmptyCategoryProductsBlock';
import Header from './Header';
import Footer from './Footer';
import MobileCatalogSortOptions from './MobileCatalogSortOptions';
import { fetchCategoryIdBySlug, fetchProductsByCategoryId, saveProductsListToMemory } from '../actions/products';
import { isMobile } from '../utilities';

class SubCategoryProductsList extends Component {
  constructor(props) {
    super(props);

    const storedProps = typeof props.products[props.match.params.category] !== 'undefined' ? props.products[props.match.params.category] : {};
    let { category, subcategory } = props.match.params;
    if (subcategory) {
      category += ':' + subcategory;
    }
    //console.log('CAT', category, this.state)
    this.state = {
      category,
      products: null,
      currentPage: 1,
      limit: 20,
      hasMore: true,
      filterEnabled: false,
      ...storedProps,
      filters: {}
    };

    console.log('CAT', category, this.state)

    //this.fetchCategory = this.fetchCategory.bind(this);
    this.fetchProductsByCategoryId = this.fetchProductsByCategoryId.bind(this);
    this._unMounted = false;
  }

  componentWillMount() {
    const { category, products, filterEnabled } = this.state;
    const searchParams = new URLSearchParams(this.props.location.search);
    let filters = {};

    for (var pair of searchParams.entries()) {
      filters = { ...filters, [pair[0]]: pair[1] };
    }
    console.log('COND', products, filterEnabled, filters, ((filterEnabled && Object.keys(filters).length) || (!filterEnabled && !Object.keys(filters).length)));
    if (products !== null && ((filterEnabled && Object.keys(filters).length) || (!filterEnabled && !Object.keys(filters).length))) {
      this.setState({
        filters
      });
      return;
    }
    console.log('R', category);
    this.fetchProductsByCategoryId(category, filters, true);
    //this.fetchCategory(category, filters);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('filters', this.props.location.search, nextProps.match.params);
    let filters = {};
    let { category, subcategory } = nextProps.match.params;
    if (subcategory) {
      category += ':' + subcategory;
    }

    if (category != this.state.category) {
      const storedProps = typeof nextProps.products[category] !== 'undefined' ? nextProps.products[category] : {};
      this.setState({
        category,
        products: null,
        currentPage: 1,
        hasMore: true,
        ...storedProps,
        filters: {}
      });
      if (storedProps.products) {
        const searchParams = new URLSearchParams(nextProps.location.search);

        for (var pair of searchParams.entries()) {
          filters = { ...filters, [pair[0]]: pair[1] };
        }

        if ((storedProps.filterEnabled && Object.keys(filters).length) || (!storedProps.filterEnabled && !Object.keys(filters).length)) {
          return;
        }
      }
      this.fetchProductsByCategoryId(category, filters);
      //this.fetchCategory(category);
      window.$$(window).scrollTop(0);
    }
  }

  componentWillUnmount() {
    this._unMounted = true;
  }

  // fetchCategory(category, filters = {}){
  //   // Fetch category Id from slug
  //   fetchCategoryIdBySlug(category).then(response => {
  //     if(response.data.length > 0){
  //       const catId = response.data;
  //       this.fetchProductsByCategoryId(catId, filters);
  //     }else{
  //       !this._unMounted && this.setState({
  //         products: []
  //       });
  //     }
  //   });
  // }

  fetchProductsByCategoryId(category, filters = {}, pagination = null, currentPage = 1) {
    const { limit } = this.state;
    pagination = typeof pagination !== 'undefined' && pagination === true;
    if (typeof filters !== 'undefined') {
      !pagination && !this._unMounted && this.setState({
        products: null
      });
    }
    !this._unMounted && fetchProductsByCategoryId(category, currentPage, limit, filters).then(response => {
      const products = pagination && this.state.products !== null ? [...this.state.products, ...response.data] : response.data;
      if (!this._unMounted) {
        this.setState({
          products,
          filters,
          hasMore: response.data.length >= limit,
          currentPage: currentPage + 1
        });
        this.props.saveProductsListToMemory(category, { filterEnabled: Object.keys(filters).length > 0, products, hasMore: response.data.length >= limit, currentPage: currentPage + 1 });
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
    const { products, category, filters, currentPage, hasMore } = this.state;
    const options = { latest: "Latest", rating: "Rating", price_desc: "Price: High to Low", price_asc: "Price: Low to High" };

    return (
      <div className="main-wrapper">
        <Header />
        {
          <>
            <div className="block-listing catalog-list">
              <div className="container">
                <div className="row">
                  <ProductListSideFilters filters={filters} category={category} fetchProductsByCategoryId={this.fetchProductsByCategoryId} />
                  <div className="col-sm-12 col-md-9 right-block-listing">
                    <ProductsGridViewTopBar options={options} category={category} products={products} />
                    {
                      products === null || products.length > 0
                        ?
                        <InfiniteScroll
                          dataLength={products === null || typeof products === 'undefined' ? 0 : products.length}
                          next={() => this.fetchProductsByCategoryId(category, filters, true, currentPage)}
                          hasMore={hasMore}
                          loader={<div style={{ textAlign: 'center', paddingBottom: '100px' }}><img width="40" src="/assets/images/spinner.svg" alt="Loading..." /></div>}
                        >
                          <ProductsGridView col={4} products={products} category={category} />
                        </InfiniteScroll>
                        :
                        <div className="completeOrderContainer pad-tp-0 category-noProduct">
                          <img src="/assets/images/no_product.gif" alt="No Product Found" />

                          <div className="empty-heading empty-headr-heading">Sorry, no product found
                          </div>
                        </div>

                    }

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
        {/* seoContent={meta_data}  */}
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    products: { ...state.Products.products }
  }
}

export default connect(mapStatesToProps, { saveProductsListToMemory })(SubCategoryProductsList);