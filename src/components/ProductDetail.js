import React, { Component } from "react";
import CompactRating from "./CompactRating";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumb from "./Breadcrumb";
import QuantityBox from "./QuantityBox";
import ProductPreviewSlider from "./products/ProductPreviewSlider";
import ProductCustomAttributes from "./products/ProductCustomAttributes";
import AddToCartButton from "./products/AddToCartButton";
import UpSellingProducts from "./products/UpSellingProducts";
import RelatedProducts from "./products/RelatedProducts";
import { fetchProduct } from "../actions/products";
import CategoryName from "./products/CategoryName";
import isSubset from "is-subset/module/index";
import {
  currencyFormat,
  percentDiscount,
  trackwebEngageEvent,
  trackFBEvent,
} from "../utilities";
import ReviewsAndRating from "./products/ReviewsAndRating";
import AddToWishListButton from "./products/AddToWishListButton";
import {
  STARRATING,
  PRODUCT_VIEW,
  MEDIA_BASE
} from "../constants";
import CheckDeliveryAvailability from "./products/CheckDeliveryAvailability";
import OutOfStockNotifyAlert from "./products/OutOfStockNotifyAlert";
import StyleGallery from "./products/StyleGallery";
import AddThisButtons from "./products/AddThisButtons";
import OtherLinkedProductsSlider from "./products/OtherLinkedProductsSlider";
import MetaData from "./MetaData";
import { getMetaData } from "../actions/seo";
import "../viewPort.js";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.initData = {
      product: {},
      productName: "",
      productUniqId: 0,
      sku: null,
      description: "",
      productDetail: "",
      featuresDescription: "",
      moreDescription: "",
      variations: [],
      attributes: {},
      slug: props.match.params.product,
      typeId: null,
      virtual: false,
      category: props.match.params.category,
      subcategory: props.match.params.subcategory,
      attributeIds: {},
      attributeIdValues: {},
      colorVariations: [],
      relatedProducts: [],
      upsellingProducts: [],
      reviews: [],
      isOutOfStock: false,
      reviewCounts: 0,
      wishlist: false,
    };
    this.qty = 1;
    this.state = this.initData;
    this.getQuantity = this.getQuantity.bind(this);
    this.fetchProductDetail = this.fetchProductDetail.bind(this);
    this._unMounted = false;
    this.attributeChanged = false;
  }
  componentWillMount() {
    const { slug } = this.state;
    this.fetchProductDetail(slug);
  }

  componentWillReceiveProps(nextProps) {
    if (this.attributeChanged) {
      this.attributeChanged = false;
      return;
    }
    const { product, category, subcategory } = nextProps.match.params;
    if (!this._unMounted && product !== this.state.slug) {
      this.setState({ ...this.initData, slug: product, category, subcategory });
      this.fetchProductDetail(nextProps.match.params.product);
      setTimeout(() => {
        window.$$(window).scrollTop(0);
      }, 100);
    }
    if (
      nextProps &&
      nextProps.meta_data &&
      nextProps.meta_data.seo &&
      nextProps.meta_data.seo.type === "product_page"
    ) {
      this.setState({
        meta_data: nextProps.meta_data.seo,
      });
    }
  }

  componentWillUnmount() {
    this._unMounted = true;
  }

  fetchProductDetail(slug) {
    fetchProduct(slug).then((response) => {
      let attributeIds = {};
      let attributeIdValues = {};
      const data = response.data;
      let isOutOfStock = true;
      if (!data.length) {
        this.props.history.push("/page-not-found");
        return;
      }
      const variations = data[1].filter((p) => {
        return true; //p.url_key == slug;
      });

      data[1].map((p) => {
        if (p.in_stock || p.is_salable != "0" || p.is_salable === true)
          isOutOfStock = false;
      });

      // Select variation color attribute
      if (variations.length && typeof variations[0].color !== "undefined") {
        const attributeId = Object.keys(data[2]).filter((attr) =>
          data[2][attr].code == "color" ? data[2][attr].id : false
        );
        if (
          typeof attributeId !== "undefined" &&
          attributeId !== null &&
          attributeId.length > 0
        ) {
          attributeIdValues["color"] = variations[0].color;
          attributeIds[attributeId[0]] = variations[0].color;
        }
        //data[0].price = variations[0].price;
      }
      // Select variation sleeves attribute
      if (variations.length && typeof variations[0].sleeves !== "undefined") {
        const attributeId = Object.keys(data[2]).filter((attr) =>
          data[2][attr].code == "sleeves" ? data[2][attr].id : false
        );

        if (
          typeof attributeId !== "undefined" &&
          attributeId !== null &&
          attributeId.length > 0
        ) {
          attributeIdValues["sleeves"] = variations[0].sleeves;
          attributeIds[attributeId[0]] = variations[0].sleeves;
        }
        //data[0].price = variations[0].price;
      }

      const productData = data[0]; //variations.length > 0 ? variations[0] : data[0];
      !this._unMounted &&
        this.setState({
          productUniqId: data[0].entity_id,
          product: productData,
          productName: data[0].name,
          wishlist: data[0].wishlist,
          sku: data[0].sku,
          xLeft: data[0].xLeft,
          colorVariations: data[0].colorVariations,
          description: data[0].additional_information,
          productDetail: data[0].description,
          featuresDescription: data[0].short_description,
          moreDescription: data[0].more_information,
          typeId: data[0].type_id,
          variations: data[1],
          attributes: data[2],
          virtual: variations.length > 0 ? false : true,
          attributeIdValues: attributeIdValues,
          attributeIds: attributeIds,
          relatedProducts: data[3],
          upsellingProducts: data[4],
          reviews: data[5],
          isOutOfStock,
          mediaGallery: data[0].media_gallery,
          ratingSummary: data[0].ratingSummary,
          reviewCounts: data[0].reviewCounts,
        });
      this.props.getMetaData("product_page", productData.sku);
      // Facebook pixel event
      trackFBEvent("ViewContent", {
        content_ids: [data[0].sku],
        content_type: "product",
        contents: [{ id: data[0].sku, quantity: 1 }],
      });

      // track webengage event
      let imageArr = [];
      if (this.state.product.media_gallery) {
        const images = Object.values(productData.media_gallery.images);
        imageArr = images.map(image => `${MEDIA_BASE}/catalog/product/${image.file}`)
      }

      let size = [];
      try {
        Object.keys(this.state.attributes).map((key) => {
          const option = this.state.attributes[key];
          const optionCode = option.code.toLowerCase();
          if (optionCode === "size") {
            option.values.map((attribute, index) => {
              size.push(attribute.label);
            });
          }
        });
      } catch (error) { }

      //console.log("imageArr",[imageArr[0]])
      trackwebEngageEvent(PRODUCT_VIEW, {
        "Product ID": productData.sku,
        "Product Name": productData.name,
        "Category Name": this.state.category,
        "Category ID": productData.category_ids && productData.category_ids.length > 0 ? productData.category_ids[0] : '',
        "Retail Price": Number(productData.price),
        "Discount": percentDiscount(
          productData.price,
          productData.finalprice
        ),
        "Price": Number(productData.finalprice),
        "Currency": "INR",
        "Size": size.length > 0 ? size.toString() : "",
        "Stock": productData.xLeft ? parseInt(productData.xLeft) : 0,
        "Image": [imageArr[0]],
      });

      const productItems = [];
    
      productItems.push({        
        'item_id': productData.sku,
        'item_name': productData.name,
        'discount': percentDiscount(
          productData.price,
          productData.finalprice
        ),
        'item_category': this.state.category ? this.state.category : '',
        'price': productData.finalprice,
        'quantity': this.qty
      });

      if (window.gtag) {
        window.gtag('event', 'select_item', {
          'item_list_id': "related_products",
          'item_list_name': "Related products",
          'items': productItems
        });
      }

    });
  }

  updateProductVariation(attributes, options, attributeIds, attrName) {
    //console.log(attributes.length, numAttributes);
    //if(Object.keys(attributes).length != options.length)
    //	return;
    const variations = this.state.variations.filter((item) => {
      return isSubset(item, attributes);
    });

    if (attributes.size) {
      let sizeOption = Object.keys(options).find(c => options[c].code === 'size')
      // console.log("SIZE OTPTION ", sizeOption)
      let key = options[sizeOption];
      // console.log("key",key)
      let value = key.values.find(c => c.id === attributes.size)
      // console.log('Value ', value, value.label)
      this.setState({
        selectedSize: value.label,
      })
    }


    if (typeof variations !== "undefined" && variations.length > 0) {
      if (attrName == "color") {
        this.props.history.push(
          `/shop/${this.state.category}/${variations[0].url_key}`
        );
        this.attributeChanged = true;
      }

      this.setState({
        product: variations[0],
        //       description: variations[0].additional_information,
        // productDetail: variations[0].description,
        // featuresDescription: variations[0].short_description,
        //typeId: variations[0].type_id,
        virtual: true,
        attributeIds,
      });

      trackFBEvent("CustomizeProduct", {});
    }
  }

  componentDidMount() {
    setTimeout(() => {
      window.$$(window).scrollTop(0);
    }, 100);
  }

  updateQuantity(qty) {
    this.qty = qty;
  }

  getQuantity() {
    return this.qty;
  }

  intersection(o1, o2) {
    return Object.keys(o1).filter({}.hasOwnProperty.bind(o2));
  }

  scrollToRatingSection() {
    const $ = window.$$;
    if (!$(".rating-and-comments:eq(0)").length) return;

    $("html, body").animate(
      {
        scrollTop: $(".rating-and-comments:eq(0)").offset().top - 48,
      },
      1000
    );
  }

  render() {
    const {
      meta_data,
      meta,
      wishlist,
      productName,
      productUniqId,
      reviewCounts,
      ratingSummary,
      mediaGallery,
      product,
      description,
      productDetail,
      featuresDescription,
      moreDescription,
      typeId,
      sku,
      subcategory,
      category,
      attributeIds,
      virtual,
      attributes,
      attributeIdValues,
      variations,
      colorVariations,
      xLeft,
      relatedProducts,
      upsellingProducts,
      reviews,
    } = this.state;
    const overallRatingSummary =
      typeof ratingSummary !== "undefined"
        ? (STARRATING.stars * ratingSummary) / 100
        : 0;
    const isOutOfStock =
      !product.in_stock ||
      product.is_salable == "0" ||
      product.is_salable === false;
    //console.log('isOutOfStock', isOutOfStock, product);
    product.finalprice =
      typeof product.finalprice !== "undefined"
        ? product.finalprice.toString().replace(",", "")
        : product.finalprice;
    return (
      <div className="main-wrapper">
        {
          // meta_data ? <Helmet>
          // 	<title>{meta_data.meta_title}</title>
          // 	<meta charSet="utf-8" />
          // 	<meta name="title" content={meta_data.meta_title} />
          // 	<meta name="description" content={meta_data.meta_description} />
          // 	<meta name="keyword" content={meta_data.meta_keywords} />
          // 	<link rel="canonical" href={meta_data.canonical_url} />
          // </Helmet> : null
        }
        <Header />
        {product.entity_id && (
          <MetaData
            data={{
              title: product.meta_title,
              keyword: product.meta_keyword,
              description: product.meta_description,
              product,
              productName,
              mediaGallery,
              productDetail,
              overallRatingSummary,
              reviewCounts,
              reviews,
            }}
          />
        )}
        <div className="product-detail-block">
          <div className="container">
            {subcategory ? (
              <Breadcrumb
                customClass="breadcrumb-ui"
                data={[
                  {
                    label: <CategoryName category={category} />,
                    link: `/product-category/${category}`,
                  },
                  {
                    label: (
                      <CategoryName category={`${category}/${subcategory}`} />
                    ),
                    link: `/product-category/${category}/${subcategory}`,
                  },
                  { label: productName },
                ]}
              />
            ) : category ? (
              <Breadcrumb
                customClass="breadcrumb-ui"
                data={[
                  {
                    label: <CategoryName category={category} />,
                    link: `/product-category/${category}`,
                  },
                  { label: productName },
                ]}
              />
            ) : (
              <Breadcrumb
                customClass="breadcrumb-ui"
                data={[{ label: productName }]}
              />
            )}

            <div className="row">
              <div className="product-preview col-sm-6">
                {
                  <AddToWishListButton
                    productId={productUniqId}
                    product={product}
                    category={category}
                    itemStyle="1"
                    status={wishlist}
                    selectedSize={this.state.selectedSize}
                  />
                }
                <ProductPreviewSlider
                  productUniqId={productUniqId}
                  media={mediaGallery}
                  entityId={product.entity_id}
                />
              </div>
              <div className="product-detail-right col-sm-6">
                <div className="block-action-product mobileblock-action-product">
                  <div className="first-info-block">
                    {false && typeof product.manufacturer !== "undefined" ? (
                      <label>{product.manufacturer}</label>
                    ) : (
                      ""
                    )}
                    <h1>{productName}</h1>

                    <div className="product-sku">SKU: {product.sku}</div>

                    {reviewCounts > 0 && (
                      <div className="rating-star">
                        <CompactRating
                          onClick={this.scrollToRatingSection}
                          overallRatingSummary={overallRatingSummary}
                          overallReviewCounts={reviewCounts}
                        />
                      </div>
                    )}

                    <div className="price-rating-section">
                      {typeId !== null && (
                        <>
                          {true || typeId != "configurable" || virtual ? (
                            <div className="value-price">
                              {typeof product.finalprice !== "undefined" &&
                                parseFloat(product.finalprice) > 0 &&
                                parseFloat(product.finalprice) !=
                                parseFloat(product.price) ? (
                                <>
                                  <span className="price-new">
                                    {currencyFormat(
                                      product.finalprice,
                                      "INR",
                                      true,
                                      0
                                    )}
                                  </span>
                                  <span className="old-price">
                                    {currencyFormat(
                                      product.price,
                                      "INR",
                                      true,
                                      0
                                    )}
                                  </span>
                                  <div className="discount-price-percentage">
                                    (
                                    {percentDiscount(
                                      product.price,
                                      product.finalprice
                                    )}
                                    % OFF)
                                  </div>
                                </>
                              ) : product.price <= 0 ? (
                                <div
                                  className="out-of-stock"
                                  style={{ color: "red" }}
                                >
                                  OUT OF STOCK
                                </div>
                              ) : (
                                <div className="price-new">
                                  {currencyFormat(
                                    product.price,
                                    "INR",
                                    true,
                                    0
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="value-price">
                              {typeof product.finalprice !== "undefined" &&
                                parseFloat(product.finalprice) > 0 ? (
                                <div className="price-new">
                                  <span className="starting-from">
                                    Starting from{" "}
                                  </span>{" "}
                                  {currencyFormat(
                                    product.finalprice,
                                    "INR",
                                    true,
                                    0
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {typeof description !== "undefined" &&
                    description !== null &&
                    description.length > 0 && (
                      <div
                        className="detail-small-discription pre"
                        dangerouslySetInnerHTML={{
                          __html: description.replace(
                            /[\r\n|\n|\r]{2,}/g,
                            "<br />"
                          ),
                        }}
                      ></div>
                    )}

                  {sku !== null && typeId == "configurable" && (
                    <ProductCustomAttributes
                      isOutOfStock={isOutOfStock}
                      sizeWidget={true}
                      type={typeId}
                      variationSku={product.sku}
                      sku={sku}
                      qty={this.getQuantity}
                      hideAttrCode={["color", "sleeves"]}
                      variations={variations}
                      attributeIds={attributeIds}
                      attributeIdValues={attributeIdValues}
                      options={attributes}
                      productId={product.entity_id}
                      onChange={this.updateProductVariation.bind(this)}
                    />
                  )}

                  {!isOutOfStock && (
                    <div className="quantity-block">
                      <h4 className="title-sm">Quantity</h4>
                      <QuantityBox
                        callback={this.updateQuantity.bind(this)}
                        min={1}
                        max={product.in_stock}
                        xLeft={xLeft}
                        showInStock={
                          typeId !== null &&
                          (typeId != "configurable" || virtual)
                        }
                      />
                    </div>
                  )}

                  {sku !== null && isOutOfStock ? (
                    <div className="outstock-block">
                      <h2>Out of Stock</h2>
                      <OutOfStockNotifyAlert productId={product.entity_id} />
                    </div>
                  ) : (
                    sku && (
                      <div className="btn-block product-detail-action mobile-d-none">
                        <AddToWishListButton
                          productId={productUniqId}
                          itemStyle="2"
                          product={product}
                          status={wishlist}
                          category={category}
                          selectedSize={this.state.selectedSize}
                        />
                        <AddToCartButton
                          selectedSize={this.state.selectedSize}
                          type={typeId}
                          product={product}
                          variationSku={product.sku}
                          entityId={product.entity_id}
                          sku={sku}
                          qty={this.getQuantity}
                          attributes={attributes}
                          options={attributeIds}
                        />

                        {/*<AddToCartButton buyNow={true} type={typeId} variationSku={product.sku} entityId={product.entity_id} sku={sku} qty={this.getQuantity} options={attributeIds} />*/}
                      </div>
                    )
                  )}

                  {typeof moreDescription !== "undefined" &&
                    moreDescription !== null &&
                    moreDescription.length > 0 && (
                      <div
                        className="product-more-information pre"
                        dangerouslySetInnerHTML={{ __html: moreDescription }}
                      ></div>
                    )}
                  {typeof product["non-rma"] !== "undefined" &&
                    product["non-rma"] != "" ? (
                    <p className="non-rma-text">{product["non-rma"]}</p>
                  ) : (
                    ""
                  )}
                </div>

                <div className="discription-product-ui">
                  {/*<div className="list-detail best-offers border-bottom">
	                           <h4 className="title-sm">Best Offers</h4>
	                              <ul className="offer-list">
	                                 <li>Coupon Code: SAVE120</li>
	                                 <li>Max Discount: 53% of MRP (Your total saving: Rs. 5830, excluding tax)</li>
	                              </ul>
	                        </div>*/}
                  {typeof productDetail !== "undefined" &&
                    productDetail !== null &&
                    productDetail.length > 0 && (
                      <div className="list-detail product-detail-list border-bottom">
                        <h4
                          className="title-sm toggle-info"
                          data-toggle="collapse"
                          href="#productDetail"
                        >
                          Product Details
                          <span className="arrow-rounded"></span>
                        </h4>
                        <div
                          id="productDetail"
                          className="tab-collapse collapse show"
                        >
                          <div
                            className="detail-list pre"
                            dangerouslySetInnerHTML={{
                              __html: productDetail.replace(
                                /[\r\n|\n|\r]{2,}/g,
                                "<br />"
                              ),
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                  {typeof featuresDescription !== "undefined" &&
                    featuresDescription !== null &&
                    featuresDescription.length > 0 && (
                      <div className="list-detail product-detail-list border-bottom">
                        <h4
                          className="title-sm toggle-info collapsed"
                          data-toggle="collapse"
                          href="#featuresDescription"
                        >
                          Additional Details
                          <span className="arrow-rounded"></span>
                        </h4>
                        <div
                          id="featuresDescription"
                          className="tab-collapse collapse"
                        >
                          <div
                            className="detail-list pre"
                            dangerouslySetInnerHTML={{
                              __html: featuresDescription.replace(
                                /[\r\n|\n|\r]{2,}/g,
                                "<br />"
                              ),
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                  <div className="list-detail product-delivery-return">
                    <h4
                      className="title-sm toggle-info"
                      data-toggle="collapse"
                      href="#productDeliveryReturn"
                    >
                      Delivery & Return Information
                      <span className="arrow-rounded"></span>
                    </h4>
                    <div
                      id="productDeliveryReturn"
                      className="tab-collapse collapse show"
                    >
                      <div className="detail-list">
                        <CheckDeliveryAvailability />
                      </div>
                    </div>
                  </div>
                </div>

                {sku !== null && isOutOfStock
                  ? ""
                  : sku && (
                    <div className="btn-block product-detail-action desktop-d-none">
                      <AddToWishListButton
                        productId={productUniqId}
                        itemStyle="2"
                        status={wishlist}
                        product={product}
                        category={category}
                        discount={percentDiscount(
                          product.price,
                          product.finalprice
                        )}
                        qty={this.getQuantity}
                        selectedSize={this.state.selectedSize}
                      />
                      <AddToCartButton
                        type={typeId}
                        variationSku={product.sku}
                        entityId={product.entity_id}
                        sku={sku}
                        qty={this.getQuantity}
                        discount={percentDiscount(
                          product.price,
                          product.finalprice
                        )}
                        attributes={attributes}
                        options={attributeIds}
                        product={product}
                      />

                      {/*<AddToCartButton buyNow={true} type={typeId} variationSku={product.sku} entityId={product.entity_id} sku={sku} qty={this.getQuantity} options={attributeIds} />*/}
                    </div>
                  )}
                <AddThisButtons />
              </div>
            </div>
          </div>
        </div>
        {typeof product.entity_id !== "undefined" && (
          <ReviewsAndRating productId={product.entity_id} data={reviews} />
        )}
        {typeof product.entity_id !== "undefined" &&
          typeof mediaGallery !== "undefined" && (
            <StyleGallery
              images={mediaGallery.images}
              productId={product.entity_id}
            />
          )}
        {colorVariations && colorVariations.length > 0 && (
          <OtherLinkedProductsSlider products={colorVariations} />
        )}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
        {upsellingProducts.length > 0 && (
          <UpSellingProducts products={upsellingProducts} />
        )}
        {/* <div id="razorpay-affordability-widget"> </div> */}
        <Footer seoContent={meta_data} />
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    meta_data: state.Seo.meta_data,
  };
};

// export default ProductDetail;
export default connect(mapStatesToProps, { getMetaData })(ProductDetail);
