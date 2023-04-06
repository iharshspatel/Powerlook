import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Header from './Header';
import Footer from './Footer';
import { loadStaticPage } from '../actions/home';
import { getMetaData } from '../actions/seo';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

class StaticPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			content: null,
			title: null,
			slug: props.match.params.pageSlug,
		};

		this.loadContent = this.loadContent.bind(this);
	}

	componentWillMount() {
		const { slug } = this.state;
		this.loadContent(slug);
		this.props.getMetaData('cms_page', slug)
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.slug !== nextProps.match.params.pageSlug) {
			window.$$('body, html').scrollTop(0);
			this.setState({
				content: null,
				title: null,
				slug: nextProps.match.params.pageSlug,
			});

			this.loadContent(nextProps.match.params.pageSlug);
		}

		if (nextProps && nextProps.meta_data && nextProps.meta_data.seo && nextProps.meta_data.seo.type === 'cms_page') {
			this.setState({
				...this.state,
				'meta_data': nextProps.meta_data.seo
			})
		}
	}

	loadContent(slug) {
		loadStaticPage(slug).then(response => {
			if (typeof response.data[0] === 'undefined') {
				this.props.history.push('/page-not-found');
				return;
			}
			this.setState({
				content: typeof response.data[0].content !== 'undefined' ? response.data[0].content : '',
				title: typeof response.data[0].title !== 'undefined' ? response.data[0].title : ''
			});
		});
	}

	render() {
		let { content, title, meta_data } = this.state;
		if (title && title.toLowerCase() === "how to order") {
			content = content.replace(/width="560"/g, "")
			let b = ' class = "w-100" ';
			let position = 7;
			content = content.slice(0, position) + b + content.slice(position)
		}
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
				{
					content !== null
						?
						<div className="contactWrapper">
							<div className="container">
								<h1 className="pageTitle">{title}</h1>
								
								<div className="pageContent" dangerouslySetInnerHTML={{ __html: content }}></div>
							</div>
						</div>
						:
						<div className="page-loader-min-height"><ReactLoading className="page-loader" type="spin" color="#E88A87" height={50} width={50} /></div>
				}
				<Footer seoContent={meta_data} />
			</div>
		);
	}
}

const mapStatesToProps = (state) => {
	return {
		meta_data: state.Seo.meta_data
	};
}

// export default StaticPage;
export default connect(mapStatesToProps, { getMetaData })(StaticPage);