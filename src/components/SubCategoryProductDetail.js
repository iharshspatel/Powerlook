import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import Header from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import QuantityBox from './QuantityBox';
import ProductPreviewSlider from './products/ProductPreviewSlider';
import ProductCustomAttributes from './products/ProductCustomAttributes';
import AddToCartButton from './products/AddToCartButton';
import UpSellingProducts from './products/UpSellingProducts';
import RelatedProducts from './products/RelatedProducts';
import { fetchProduct } from '../actions/products';
import CategoryName from './products/CategoryName';
import isSubset from 'is-subset/module/index';
import { currencyFormat, percentDiscount, trackwebEngageEvent } from '../utilities';
import ReviewsAndRating from './products/ReviewsAndRating';
import AddToWishListButton from './products/AddToWishListButton';
import { PRODUCT_VIEW, STARRATING, MEDIA_BASE } from '../constants';
import CheckDeliveryAvailability from './products/CheckDeliveryAvailability';
import OutOfStockNotifyAlert from './products/OutOfStockNotifyAlert';
import StyleGallery from './products/StyleGallery';
import AddThisButtons from './products/AddThisButtons';
import OtherLinkedProducts from './products/OtherLinkedProducts';
class ProductDetail extends Component {

	constructor(props) {
		super(props);
		this.initData = {
			product: {},
			sku: null,
			description: '',
			productDetail: '',
			featuresDescription: '',
			variations: [],
			attributes: {},
			slug: props.match.params.product,
			typeId: null,
			virtual: false,
			category: props.match.params.category,
			attributeIds: {},
			attributeIdValues: {},
			colorVariations: [],
			relatedProducts: [],
			upsellingProducts: [],
			reviews: [],
			isOutOfStock: false
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
		const { product, category } = nextProps.match.params;
		if (!this._unMounted && product != this.state.slug) {
			this.setState({ ...this.initData, slug: product, category });
			this.fetchProductDetail(nextProps.match.params.product);
			window.$$(window).scrollTop(0);
		}
	}

	componentWillUnmount() {
		this._unMounted = true;
	}

	fetchProductDetail(slug) {
		fetchProduct(slug).then(response => {
			let attributeIds = {};
			let attributeIdValues = {};
			const data = response.data;
			let isOutOfStock = true;
			if (!data.length) {
				this.props.history.push('/page-not-found');
				return;
			}
			const variations = data[1].filter(p => {
				return true; //p.url_key == slug;
			});

			data[1].map(p => {
				if (p.in_stock || p.is_salable != '0' || p.is_salable === true)
					isOutOfStock = false;
			});

			// Select variation color attribute
			if (variations.length && typeof variations[0].color !== 'undefined') {
				const attributeId = Object.keys(data[2]).filter(attr => data[2][attr].code == 'color' ? data[2][attr].id : false);
				attributeIdValues['color'] = variations[0].color;
				attributeIds[attributeId[0]] = variations[0].color;
				//data[0].price = variations[0].price;
			}
			// Select variation sleeves attribute
			if (variations.length && typeof variations[0].sleeves !== 'undefined') {
				const attributeId = Object.keys(data[2]).filter(attr => data[2][attr].code == 'sleeves' ? data[2][attr].id : false);
				attributeIdValues['sleeves'] = variations[0].sleeves;
				attributeIds[attributeId[0]] = variations[0].sleeves;
				//data[0].price = variations[0].price;
			}

			const productData = data[0]; //variations.length > 0 ? variations[0] : data[0];
			!this._unMounted && this.setState({
				product: productData,
				sku: data[0].sku,
				xLeft: data[0].xLeft,
				colorVariations: data[0].colorVariations,
				description: data[0].additional_information,
				productDetail: data[0].description,
				featuresDescription: data[0].short_description,
				typeId: data[0].type_id,
				variations: data[1],
				attributes: data[2],
				virtual: variations.length > 0 ? false : true,
				attributeIdValues: attributeIdValues,
				attributeIds: attributeIds,
				relatedProducts: data[3],
				upsellingProducts: data[4],
				reviews: data[5],
				isOutOfStock
			});

			// track webengage event
			let imageArr = [];
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

			if (this.state.product.media_gallery) {
				const images = Object.values(productData.media_gallery.images);
				imageArr = images.map(image => `${MEDIA_BASE}/catalog/product/${image.file}`)
			}
			trackwebEngageEvent(PRODUCT_VIEW, {
				"Product ID": productData.entity_id,
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
				"Image": imageArr,
			});
		});
	}

	updateProductVariation(attributes, options, attributeIds, attrName) {
		//console.log(attributes.length, numAttributes);
		//if(Object.keys(attributes).length != options.length)
		//	return;
		const variations = this.state.variations.filter(item => {
			return isSubset(item, attributes);
		});

		if (typeof variations !== 'undefined' && variations.length > 0) {

			if (attrName == 'color') {
				this.props.history.push(`/shop/${this.state.category}/${variations[0].url_key}`);
				this.attributeChanged = true;
			}

			this.setState({
				product: variations[0],
				description: variations[0].additional_information,
				productDetail: variations[0].description,
				featuresDescription: variations[0].short_description,
				//typeId: variations[0].type_id,
				virtual: true,
				attributeIds
			});
		}
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
		if (!$(".rating-and-comments:eq(0)").length)
			return;

		$('html, body').animate({
			scrollTop: $(".rating-and-comments:eq(0)").offset().top - 48
		}, 1000);
	}

	render() {
		const { isOutOfStock, product, description, productDetail, featuresDescription, typeId, sku, category, attributeIds, virtual, attributes, attributeIdValues, variations, colorVariations, xLeft, relatedProducts, upsellingProducts, reviews } = this.state;
		const overallRatingSummary = typeof product.ratingSummary !== 'undefined' ? STARRATING.stars * product.ratingSummary / 100 : 0;
		//const isOutOfStock = !product.in_stock || product.is_salable == '0' || product.is_salable === false;
		product.finalprice = typeof product.finalprice !== 'undefined' ? product.finalprice.toString().replace(',', '') : product.finalprice;
		return (
			<div className="main-wrapper">
				<Header />
				<div className="product-detail-block">
					<div className="container">
						{
							category
								?
								<Breadcrumb customClass="breadcrumb-ui" data={[{ label: <CategoryName category={category} />, link: `/product-category/${category}` }, { label: product.name }]} />
								:
								<Breadcrumb customClass="breadcrumb-ui" data={[{ label: product.name }]} />
						}
						<div className="row">
							<div className="product-preview col-sm-6">
								{product.entity_id && <AddToWishListButton productId={product.entity_id} itemStyle="1" product={product} category={category} status={product.wishlist} />}
								<ProductPreviewSlider media={product.media_gallery} entityId={product.entity_id} />
							</div>
							<div className="product-detail-right col-sm-6">
								<div className="block-action-product">
									<div className="first-info-block">
										{
											typeof product.manufacturer !== 'undefined'
											&&
											<label>{product.manufacturer}</label>
										}
										<h1>{product.name}</h1>

										<div className="product-sku">
											SKU: {product.sku}
										</div>
										<div className="rating-star">
											<StarRatings
												rating={overallRatingSummary}
												starRatedColor={STARRATING.color}
												numberOfStars={STARRATING.stars}
												starDimension="12px"
												starSpacing="0"
												name='rating'
											/> <span onClick={this.scrollToRatingSection} className="star-counter">{product.reviewCounts > 0 ? product.reviewCounts : 0} reviews</span>
										</div>
										{
											typeId !== null
											&&
											<>
												{
													(true || typeId != 'configurable' || virtual)
														?
														<div className="value-price">
															{
																typeof product.finalprice !== 'undefined'
																	&&
																	parseFloat(product.finalprice) > 0
																	&&
																	parseFloat(product.finalprice) != parseFloat(product.price)
																	?
																	<>
																		<span className="price-new">{currencyFormat(product.finalprice, 'INR')}</span>
																		<span className="old-price">{currencyFormat(product.price, 'INR')}</span>
																		<div className="discount-price-percentage">({percentDiscount(product.price, product.finalprice)}% OFF)</div>
																	</>
																	:
																	<div className="price-new">{currencyFormat(product.price, 'INR')}</div>
															}
														</div>
														:
														<div className="value-price">
															{
																typeof product.finalprice !== 'undefined'
																	&&
																	parseFloat(product.finalprice) > 0
																	?
																	<div className="price-new"><span className="starting-from">Starting from </span> {currencyFormat(product.finalprice, 'INR')}</div>
																	:
																	''
															}
														</div>
												}
											</>

										}

									</div>

									{
										typeof description !== 'undefined'
										&&
										description !== null
										&&
										description.length > 0
										&&
										<div className="detail-small-discription pre" dangerouslySetInnerHTML={{ __html: description.replace(/[\r\n|\n|\r]{2,}/g, "<br /><br />") }} >
										</div>
									}

									{
										colorVariations && colorVariations.length > 0
										&&
										<OtherLinkedProducts products={colorVariations} />
									}

									{
										sku !== null && typeId == 'configurable'
										&&
										<ProductCustomAttributes hideAttrCode={["color", "sleeves"]} variations={variations} attributeIds={attributeIds} attributeIdValues={attributeIdValues} options={attributes} productId={product.entity_id} onChange={this.updateProductVariation.bind(this)} />
									}

									{
										!isOutOfStock
										&&
										<div className="quantity-block">
											<h4 className="title-sm">Quantity</h4>
											<QuantityBox callback={this.updateQuantity.bind(this)} min={1} max={product.in_stock} xLeft={xLeft} showInStock={typeId !== null && (typeId != 'configurable' || virtual)} />
										</div>
									}

									{
										sku !== null && isOutOfStock
											?
											<div class="outstock-block">
												<h2>Out of Stock</h2>
												<OutOfStockNotifyAlert productId={product.entity_id} />
											</div>
											:
											sku
											&&
											<div className="btn-block product-detail-action">

												<AddToCartButton buyNow={true} type={typeId} entityId={product.entity_id} sku={sku} qty={this.getQuantity} options={attributeIds} />

												<AddToCartButton type={typeId} entityId={product.entity_id} sku={sku} qty={this.getQuantity} attributes={attributes} options={attributeIds} />

											</div>
									}
								</div>


								<div className="discription-product-ui">


									{/*<div className="list-detail best-offers border-bottom">
	                           <h4 className="title-sm">Best Offers</h4>
	                              <ul className="offer-list">
	                                 <li>Coupon Code: SAVE120</li>
	                                 <li>Max Discount: 53% of MRP (Your total saving: Rs. 5830, excluding tax)</li>
	                              </ul>
	                        </div>*/}
									{
										typeof productDetail !== 'undefined'
										&&
										productDetail !== null
										&&
										productDetail.length > 0
										&&
										<div className="list-detail product-detail-list border-bottom">
											<h4 className="title-sm toggle-info collapsed" data-toggle="collapse" href="#productDetail">
												Product Details
												<span className="arrow-rounded"></span>
											</h4>
											<div id="productDetail" className="tab-collapse collapse">
												<div className="detail-list pre" dangerouslySetInnerHTML={{ __html: productDetail.replace(/[\r\n|\n|\r]{2,}/g, "<br /><br />") }}></div>
											</div>
										</div>
									}

									{
										typeof featuresDescription !== 'undefined'
										&&
										featuresDescription !== null
										&&
										featuresDescription.length > 0
										&&
										<div className="list-detail product-detail-list border-bottom">
											<h4 className="title-sm toggle-info collapsed" data-toggle="collapse" href="#featuresDescription">
												Description
												<span className="arrow-rounded"></span>
											</h4>
											<div id="featuresDescription" className="tab-collapse collapse">
												<div className="detail-list pre" dangerouslySetInnerHTML={{ __html: featuresDescription.replace(/[\r\n|\n|\r]{2,}/g, "<br /><br />") }}></div>
											</div>
										</div>
									}

									<div className="list-detail product-delivery-return">
										<h4 className="title-sm toggle-info" data-toggle="collapse" href="#productDeliveryReturn">
											Delivery & Return Information
											<span className="arrow-rounded"></span>
										</h4>
										<div id="productDeliveryReturn" className="tab-collapse collapse show">
											<div className="detail-list">
												<CheckDeliveryAvailability />
											</div>
										</div>
									</div>
								</div>
								<AddThisButtons />
							</div>
						</div>
					</div>
				</div>
				{
					typeof product.entity_id !== 'undefined'
					&&
					<ReviewsAndRating productId={product.entity_id} data={reviews} />
				}
				{
					typeof product.entity_id !== 'undefined'
					&&
					typeof product.media_gallery !== 'undefined'
					&&
					<StyleGallery images={product.media_gallery.images} productId={product.entity_id} />
				}
				{
					relatedProducts.length > 0
					&&
					<RelatedProducts products={relatedProducts} />
				}
				{
					upsellingProducts.length > 0
					&&
					<UpSellingProducts products={upsellingProducts} />
				}
				<Footer />
				{/* seoContent={meta_data} */}
			</div>
		);
	}
}

export default ProductDetail;
