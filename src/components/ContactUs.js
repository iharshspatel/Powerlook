/* eslint-disable no-useless-constructor */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';

class StaticPage extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="main-wrapper">
				<Header />
				{
					<div className="contactWrapper">
						<div className="container">
							<div className="row">
								<div className="col">
									{/* col-lg-10 offset-md-2 */}
									<h1 className="pageTitle">Contact Us</h1>
									
								</div>
							</div>
							<div className="row">
								{/* <div className="col-md-5 offset-md-2">
			                     <div className="contactDetail">
			                        <figure className="img"><img src="/assets/images/liveChat.svg" alt=""/></figure>
			                        <h5 className="title">Live Chat</h5>
			                        <p>24*7 hours always at your service. Need more support? </p>
			                        <a className="linkCap" href="javascript:void(0);">Coming Soon</a>
			                     </div>
			                  </div> */}
								<div className="col-6 d-flex justify-content-start">
									{/* col-md-5 offset-md-2 */}
									<div className="contactDetail">
										<figure className="img">
											<img src="/assets/images/phone.svg" alt="" />
										</figure>
										<h5 className="title">Call Now</h5>
										<p><a className="phNo" href="javascript:void(0);">+91 966-7976-977</a></p>
										<span className="timing">Mon - Sat : 10:00 am - 07:00 pm</span>
									</div>
								</div>
								<div className="col-6 d-flex justify-content-end">
									{/* col-md-5 offset-md-2 */}
									<div className="contactDetail">
										<figure className="img"><img src="/assets/images/mail.svg" alt="" /></figure>
										<h5 className="title">Drop an Email</h5>
										<p><a className="phNo" href="javascript:void(0);">support@powerlook.in</a></p>
										<p>We will try to revert you ASAP.</p>
									</div>
								</div>
							</div>
							{/* <div className="row">
								<div className="col-md-5 offset-md-2">
									<div className="contactDetail">
										<figure className="img"><img src="/assets/images/mail.svg" alt="" /></figure>
										<h5 className="title">Drop an Email</h5>
										<p><a className="phNo" href="javascript:void(0);">support@powerlook.in</a></p>
										<p>We will try to revert you ASAP.</p>
									</div>
								</div>
								<div className="col-md-5">
									<div className="contactDetail">
										<figure className="img"><img src="/assets/images/QA.svg" alt="" /></figure>
										<h5 className="title">Frequently Asked Questions</h5>
										<p>You can find most popular questions here.</p>
										<a className="linkCap" href="javascript:void(0);">Coming Soon</a>
									</div>
								</div>
							</div> */}
						</div>
					</div>
				}
				<Footer />
				{/* seoContent={meta_data} */}
			</div>
		);
	}
}

export default StaticPage;
