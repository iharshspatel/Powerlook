import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SingleProductCardSkeleton from './SingleProductCardSkeleton';
import ProductItemCard from './products/ProductItemCard';
import Pagination from './Pagination';

class ProductsGridView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			moreProducts: typeof props.moreProducts !== 'undefined' ? props.moreProducts : false,
			pagination: typeof props.pagination !== 'undefined' ? props.pagination : false,
			products: props.products,
			category: props.category
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.products !== this.state.products || nextProps.category !== this.state.category) {
			this.setState({
				products: nextProps.products,
				category: nextProps.category
			});
		}
	}

	render() {
		const { pagination, products, category, moreProducts } = this.state;
		const col = typeof this.props.col !== 'undefined' ? this.props.col : 4;

		return (
			<div className={`grid-block-product m-b80 ${typeof this.props.customClass !== 'undefined' ? this.props.customClass : ''}`}>
				<div className="container">
					<div className="row">
						{
							products === null || typeof products === 'undefined'
								?
								<SingleProductCardSkeleton count={col} col={12 / col} />
								:
								<>
									{
										products.map((product, index) => {
											let image = typeof product.thumbnail !== 'undefined' ? product.thumbnail : null;
											//(parseFloat(product.min_price) > 0 ? product.min_price : product.max_price)
											let price = product.type_id === 'configurable' ? (typeof product.price !== 'undefined' ? product.price : product.min_price) : product.price;

											let categorySlug = typeof product.category !== 'undefined' ? product.category : category;
											return <div className={`col-sm-${col}`} key={product.type_id + index}>
												<ProductItemCard is_salable={product.is_salable} category={categorySlug} name={product.name} price={price} final_price={product.final_price} image={image} url_key={product.url_key} entity_id={product.entity_id} reviewCounts={product.reviewCounts} ratingSummary={product.ratingSummary} wishlist={product.wishlist} productLabel={product.product_label} productLabelBgColor={product.product_label_bg_color} meta={true} />
											</div>
										})
									}
								</>
						}
					</div>
					{
						moreProducts
						&&
						<>
							{
								pagination
									?
									<Pagination />
									:
									<div className="btn-block text-center all-product">
										<Link to={moreProducts} className="btn-border"><span>View ALL Products</span><i className="icon-arrow-righ-v1"></i></Link>
									</div>
							}
						</>
					}
				</div>
			</div>
		);
	}
}

export default ProductsGridView;
