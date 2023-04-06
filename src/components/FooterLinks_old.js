import React, { Component } from 'react';
import CategoriesLinks from './CategoriesLinks';
import FooterBottomSection from './FooterBottomSection';
import FooterStaticPages from './FooterStaticPages';

class FooterLinks extends Component {
	
  render() {
    return (
      <div className="site-footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-3">
                        <div className="footer-block">
                            <h5 className="footer-title">Registered Office Address</h5>
                            <div className="f-address">
                                <p>116/929-930, <br />BEST Nagar Road, Motilal Nagar-1, <br />Goregaon west Mumbai - 400104</p>
                            </div>
                        </div>
                        <div className="footer-block">
                            <h5 className="footer-title">Office Timings</h5>
                            <div className="f-address">
                                <p>Mon - Sat : 10:30 am - 6:30 pm</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-1 d-none d-lg-block"></div>
                    <div className="col-md-6 col-lg-4">
                        <h5 className="footer-title">
                            Useful links
                        </h5>
                        <FooterStaticPages />
                    </div>
                    <div className="col-md-6 col-lg-2">
                        <h5 className="footer-title">
                            Categories
                        </h5>
                        <CategoriesLinks customClassName="footer-nav" />
                    </div>
                    <div className="col-md-6 col-lg-2">
                        <h5 className="footer-title">
                            Support
                        </h5>
                        <div className="support">
                            <h6>Mail</h6>
                            <ul>
                                <li>
                                    <a href="mailto:support@powerlook.in">support@powerlook.in</a>
                                </li>
                            </ul>
                        </div>
                        <div className="support m-t30">
                            <h6>Phone</h6>
                            <ul>
                                <li>
                                    <a href="tel:9667976977">+91 966-7976-977</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <FooterBottomSection />
        </div>
    );
  }
}

export default FooterLinks;
