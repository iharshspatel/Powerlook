import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Header from './Header';
import Footer from './Footer';
import { loadStores } from '../actions/home';
import MapContainer from './MapContainer';

class StoreLocator extends Component {

	constructor(props) {
		super(props);

		this.state = {
			stores: null
		};
	}

	componentWillMount() {
		loadStores().then(response => {
			this.setState({
				stores: response.data
			});
		});
	}

	render() {
		const { stores } = this.state;

		return (
			<div className="main-wrapper">
				<Header />
				{
					stores !== null
						?
						<div className="store-locator-block">
							<div className="heading-block text-center">
								<div className="container">
									<h2 data-aos="fade-up" data-aos-delay="100">STORE LOCATOR</h2>
									<div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
								</div>
							</div>
							<div className="container">
								<div className="row">
									<div className="col-md-12">
										<div className="map-wrapper">
											{/*<MapContainer markers={stores} />*/}
											<img src="/assets/images/store_locations.jpg" alt="" />
										</div>
									</div>
								</div>
								<div className="row">

									{
										stores.map(store => {
											const businessHours = store.schedule.openingHours.filter(o => {
												return o.length > 0
											})
											return <div key={store.id} className="col-md-4">
												<div className="store-blck-lft-align">
													<div key={store.id} className="store-address">
														<span className="title">{store.name}</span>
														<p>{store.address}</p>
														<p className="m-t10">Contact Details:<br />Phone: {store.contact_phone}</p>
														{
															businessHours.length > 0
															&&
															<p className="m-t10">
																Business Hours:<br />
																{businessHours[0][0].start_time} to {businessHours[0][0].end_time} (open {businessHours.length} days a week)

															</p>

														}
														<p>
															<a target="_blank" className="btn-fil-primary m-t24 btn-sm" href={store.directionUrl}>Direction</a>
														</p>

													</div>
												</div>
											</div>
										})
									}

								</div>

							</div>
						</div>
						:
						<div className="page-loader-min-height"><ReactLoading className="page-loader" type="spin" color="#E88A87" height={50} width={50} /></div>
				}
				<Footer />
				{/* seoContent={meta_data} */}
			</div>
		);
	}
}

export default StoreLocator;