import React, { Component } from 'react';
import { connect } from 'react-redux';
import ScrollUpButton from "react-scroll-up-button";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductListSideFilters from './products/ProductListSideFilters';
import ProductsGridViewTopBar from './products/ProductsGridViewTopBar';
import ProductsGridView from './ProductsGridView';
import Header from './Header';
import Footer from './Footer';
import MobileCatalogSortOptions from './MobileCatalogSortOptions';
import { fetchProductsByCategoryId, saveProductsListToMemory } from '../actions/products';
import { isMobile, percentDiscount, trackwebEngageEvent } from '../utilities';
import { getMetaData } from '../actions/seo';
import { Helmet } from 'react-helmet';
import { CATEGORY_VIEWED, FILTER } from '../constants';

class ProductsList extends Component {
  constructor(props) {
    super(props);

    let { category, subcategory } = props.match.params;
    this.props.getMetaData('category_page', subcategory ? subcategory : category);
    if (subcategory) {
      category += ':' + subcategory;
    }
    const storedProps = typeof props.products[category] !== 'undefined' ? props.products[category] : {};
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
    if (products !== null && ((filterEnabled && Object.keys(filters).length) || (!filterEnabled && !Object.keys(filters).length))) {
      this.setState({
        filters
      });
      return;
    }
    this.fetchProductsByCategoryId(category, filters, true);
    //this.fetchCategory(category, filters);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.meta_data && nextProps.meta_data.seo && nextProps.meta_data.seo.type === 'category_page') {
      this.setState({
        ...this.state,
        'meta_data': nextProps.meta_data.seo
      })
    }

    // console.log('filters', this.props.location.search, nextProps.match.params);
    let filters = {};
    let { category, subcategory } = nextProps.match.params;
    if (subcategory) {
      category += ':' + subcategory;
    }

    if (category !== this.state.category) {
      const storedProps = typeof nextProps.products[category] !== 'undefined' ? nextProps.products[category] : {};
      this.setState({
        category,
        products: null,
        currentPage: 1,
        hasMore: true,
        ...storedProps,
        filters: {}
      });
      this.props.getMetaData('category_page', category);
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
    window.IsBackBtnPressed = null;
  }

  componentDidMount() {
    if (!window.IsBackBtnPressed) {
      setTimeout(() => {
        window.$$(window).scrollTop(0);
      }, 100);
    }

    window.IsBackBtnPressed = null;
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
      let category_id = '';
      if (products && products.length > 0 && products[0].attribute_set_id) {
        category_id = products[0].attribute_set_id;
      }
      const productCategory = category.split(":");
      if (Object.keys(filters).length <= 0) {
        if (productCategory.length > 1) {
          trackwebEngageEvent(CATEGORY_VIEWED, { "Category Id": category_id, "Category Name": productCategory[0], "Item Count": products.length, "Sub Category Name": productCategory[1] });
        }
        else {
          trackwebEngageEvent(CATEGORY_VIEWED, { "Category Id": category_id, "Category Name": productCategory[0], "Item Count": products.length });
        }
      }

      const productItems = [];
      
      products.map( item => {
        productItems.push({
          'item_id': item.sku,
          'item_name': item.name,          
          'discount': percentDiscount(
            item.price,
            item.final_price
          ),
          'item_category': this.state.category ? this.state.category : '',
          'price': item.final_price,
          'quantity': 1
        });
      });

      if (window.gtag) {
        window.gtag('event', 'view_item_list', {
          'item_list_id': "related_products",
          'item_list_name': this.state.category,
          'items': productItems
        });
      }

      if (!this._unMounted) {
        this.setState({
          products,
          filters,
          hasMore: response.data.length >= limit,
          currentPage: currentPage + 1
        });


        if (Object.keys(filters).length !== 0) {
          const spliD = window.location.search.split("?");
          const paramsD =
            spliD && spliD.length > 1 ? spliD[1].split("&") : null;
          const filteredData = localStorage.getItem("filteredData");
          if (paramsD && paramsD.length > 0 && filteredData) {
            const data = JSON.parse(filteredData);
            const webEngageObj = {};
            paramsD.forEach((p) => {
              const [name, value] = p.split("=");
              const b = data.find((d) => d.code === name);
              if (b) {
                let val = b.values.filter((v) =>
                  value.split("%2C").includes(v.value)
                );
                if (val && val.length > 0) {
                  val = val.map((v) => v.label);
                  const key = name;
                  webEngageObj[key] = val.toString();
                }
              }
            });
            trackwebEngageEvent(FILTER, webEngageObj);
          }
        }

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
    const { products, category, filters, currentPage, hasMore, meta_data } = this.state;
    const options = { latest: "Latest", rating: "Rating", price_desc: "Price: High to Low", price_asc: "Price: Low to High" };
    let seoContent = {};
    if (products !== null && products.length > 0 && typeof products[0].cat_cms_content !== 'undefined') {
      seoContent = {
        'cms_block_data': `<div class="container">${products[0].cat_cms_content}</div> `
      };
    }
    return (
      <div className="main-wrapper">
        {
          // meta_data ? <Helmet>
          //   <title>{meta_data.meta_title}</title>
          //   <meta charSet="utf-8" />
          //   <meta name="title" content={meta_data.meta_title} />
          //   <meta name="description" content={meta_data.meta_description} />
          //   <meta name="keyword" content={meta_data.meta_keywords} />
          //   <link rel="canonical" href={meta_data.canonical_url} />
          // </Helmet> : null
        }
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
                          scrollThreshold='0.5'
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
        <Footer seoContent={seoContent} />
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    products: { ...state.Products.products },
    meta_data: state.Seo.meta_data
  }
}

export default connect(mapStatesToProps, { saveProductsListToMemory, getMetaData })(ProductsList);