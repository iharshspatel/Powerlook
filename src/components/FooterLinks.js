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
                  <p>Mon - Sat : 10:00 am - 07:00 pm</p>
                </div>
              </div>
            </div>
            <div className="col-lg-1 d-none d-lg-block" />
            <div className="col-md-6 col-lg-4">
              <h5 className="footer-title">Useful links</h5>
              <div className="footer-nav useful-links">
                <ul>
                  <li><a href="https://careers.powerlook.in/" target="_blank">Careers</a></li>
                  <li><a href="/about-us">About Us</a></li>
                  <li><a href="/returns-exchange-refund">Returns, Exchange &amp; Refund</a></li>
                  <li><a href="/shipping-policy">Shipping Policy</a></li>
                  <li><a href="/terms-and-conditions">Terms and conditions</a></li>
                  <li><a href="/privacy-policy">Privacy Policy</a></li>
                  <li><a href="/cancellation-policy">Cancellation Policy</a></li>
                  <li><a href="/how-to-order">How to Order</a></li>
                  <li><a href="/fan-page">Powerlook Fanworld</a></li>
                  <li><a href="/affiliate-program">Affiliate Program</a></li>
                  <li><a href="/contactus">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 col-lg-2">
              <h5 className="footer-title">Categories</h5>
              <div className="footer-nav">
                <ul>
                  <li><a href="/product-category/t-shirts">T-Shirts</a></li>
                  <li><a href="/product-category/shirts">Shirts</a></li>
                  <li><a href="/product-category/bottoms">Bottoms</a></li>
                  <li><a href="/product-category/jackets">Jacket</a></li>
                  <li><a href="/product-category/co-ords-for-men">Co-ords</a></li>
                  <li><a href="/product-category/accessories">Accessories</a></li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 col-lg-2">
              <h5 className="footer-title">Support</h5>
              <div className="support">
                <h6>Mail</h6>
                <ul>
                  <li><a href="mailto:support@powerlook.in">support@powerlook.in</a></li>
                </ul>
              </div>
              <div className="support m-t30">
                <h6>Phone</h6>
                <ul>
                  <li><a href="tel:9667976977">+91 966-7976-977</a></li>
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
