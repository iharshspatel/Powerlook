import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeroSlider from './home/HeroSlider';
import MobileHeroSlider from './home/MobileHeroSlider';
import ProductCategoriesBlock from './home/ProductCategoriesBlock';
import ProductsBlock from './home/ProductsBlock';
import FlashSaleProductsBlock from './home/FlashSaleProductsBlock';
import BannersBlock from './home/BannersBlock';
//import LatestTrendsBlock from './home/LatestTrendsBlock';
import TopRatedProducts from './home/TopRatedProducts';
import Header from './Header';
import Footer from './Footer';
//import {ROUTES} from '../routes';
import { fetchLayout } from '../actions/home';
import { getMetaData } from '../actions/seo';
import { isMobile, setSessionItem } from '../utilities';
import ReviewHome from './reviews/ReviewHome';



class Home extends Component {

	constructor(props) {
		super(props);

		this.state = {
			components: props.components,
			status: props.status
		};
	}

	componentWillMount() {
		console.log("WILL MOUNT");
		this.props.getMetaData('cms_page', 'home');
		if (!this.state.components.length)
			this.props.fetchLayout();
	}

	componentDidMount() {
		var interval = setInterval(() => {
			if(typeof window.wizzySearchInit === "function") {
				window.wizzySearchInit();
				clearInterval(interval);
			}
		}, 200);
	}

	onResolved() {
		console.log('Recaptcha resolved with response: ');
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.compName === 'home_layout' && nextProps.status !== this.state.status) {
			this.setState({
				components: nextProps.components,
				status: nextProps.status
			});
		}
		if (nextProps && nextProps.meta_data && nextProps.meta_data.seo && nextProps.meta_data.seo.type === 'cms_page') {
			this.setState({
				...this.state,
				'meta_data': nextProps.meta_data.seo
			})
		}
	}

	renderElement(item, index) {
		let element = null;
		index = Object.keys(item)[0];
		item = item[index];
		if (!item)
			return element;

		switch (index) {
			case 'slider':

				element = isMobile() ? <MobileHeroSlider slides={item} /> : <HeroSlider slides={item} />;
				break;

			case 'category':
				element = <ProductCategoriesBlock categories={item} />;
				break;

			case 'product':
				element = <ProductsBlock moreProducts={`/product-category/${item.category}`} products={item.items} category={item.category} name={item.name} description={item.description} limit={item.numberofproduct} />;
				break;

			case 'flash_sale':
				element = <FlashSaleProductsBlock id={item.id} sale={item.sale} products={item.products} />;
				break;

			case 'banner':
				item.layoutid = isMobile() ? 1 : item.layoutid;
				element = <BannersBlock images={item.items} layoutId={item.layoutid} bannerId={item.bannerid} title={item.title} subtitle={item.subtitle} />;
				break;

			case 'top_rated_products':
				element = <TopRatedProducts products={item} />;
				break;

			case 'x_left':
				setSessionItem('x_left', item);
				element = null;
				break;

			case 'customer_reviews':
				element = <ReviewHome reviews={item.reviews} title={item.review_main_title} />
				break;
			default:
				element = null;
		}

		return element;
	}

	render() {
		const { components, meta_data } = this.state;

		return (

			<div className="main-wrapper">
				{
					// meta_data ? <Helmet>
					// 	<meta charSet="utf-8" />
					// 	<title>{meta_data.meta_title}</title>
					// 	<meta name="title" content={meta_data.meta_title} />
					// 	<meta name="description" content={meta_data.meta_description} />
					// 	<meta name="keyword" content={meta_data.meta_keywords} />
					// 	<link rel="canonical" href={meta_data.canonical_url} />
					// </Helmet> : null
				}
				<Header />
				{
					Object.keys(components).length > 0
						?
						Object.keys(components).map(index => {
							return <React.Fragment key={index}>{this.renderElement(components[index], index)}</React.Fragment>
						})
						:
						isMobile() ? <MobileHeroSlider slides={null} /> : <HeroSlider slides={null} />
				}
				<Footer seoContent={meta_data} />
			</div>
		);
	}
}

const mapStatesToProps = (state) => {
	return {
		components: { ...state.Home.components },
		status: state.Home.status,
		compName: state.Home.compName,
		meta_data: state.Seo.meta_data
	};
}

export default connect(mapStatesToProps, { fetchLayout, getMetaData })(Home);
