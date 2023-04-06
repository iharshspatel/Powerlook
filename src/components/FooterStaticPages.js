import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { staticPagesList } from '../actions/home';

class FooterStaticPages extends Component {

	constructor(props) {
		super(props);

		this.state = {
			pages: []
		};
	}

	componentWillMount() {
		staticPagesList().then(response => {
			this.setState({
				pages: response.data
			});
		});
	}

	render() {
		const { pages } = this.state;
		return (
			<div className="footer-nav useful-links">
				<ul>
					<li><Link to="/contactus">Contact Us</Link></li>
					{
						pages.map(page => {
							return <li key={page.page_id}><Link to={`/${page.identifier}`}>{page.title}</Link></li>
						})
					}
				</ul>
			</div>
		);
	}
}

export default FooterStaticPages;