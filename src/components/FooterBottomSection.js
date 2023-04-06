import React, { Component } from 'react';
import { SOCIAL } from '../constants';
import { trackwebEngageEvent } from '../utilities';
import FollowusOn from './products/FollowusOn';

class FooterBottomSection extends Component {

    webEngageSocial(e){
      trackwebEngageEvent(SOCIAL , {
        "Social media name" : e.currentTarget.attributes['social'].value,
        "Page URL" : window.location.href,

      });
    }

    render() {
        return (
            <>
                <div className="site-info-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="f-cards">
                                    <span className="fs-13 d-inline-block">100% Secure Payment</span>
                                    <span className="d-inline-block">
                                        <img src="/assets/images/payments-logo.svg" alt="" />
                                    </span>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                {/*<FollowusOn />*/}
                                <div className="social-block-in">
                                    <strong>Follow us:</strong>
                                    <ul>
                                        <li>
                                            <a target="_blank" social="Facebook" onClick={(e) => this.webEngageSocial(e)} href="https://www.facebook.com/powerlookofficial">
                                                <img src="/assets/images/fb-social.svg" alt="Facebook" />
                                            </a>
                                        </li>
                                        <li>
                                            <a target="_blank" social="Instagram" onClick={(e) => this.webEngageSocial(e)} href="https://www.instagram.com/powerlookofficial">
                                                <img src="/assets/images/instagram.svg" alt="Instagram" />
                                            </a>
                                        </li>
                                        <li>
                                            <a target="_blank" social="Pinterest" onClick={(e) => this.webEngageSocial(e)} href="https://in.pinterest.com/powerlookofficial">
                                                <img src="/assets/images/pinterest.svg" alt="Pinterest" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="site-info">
                    <div className="container">
                        <p>© 2022 www.powerlook.in. All rights reserved.</p>
                    </div>
                </div>

                <a className="floting-btn" target="_blank" href="https://wa.me/918104774883?text=Hey,%20I%20have%20a%20query.%20Can%20you%20help%20me%20with%20that?">
                    <img src="/assets/images/whatsapp.svg" alt="img" />
                </a>
            </>
        );
    }
}

export default FooterBottomSection;
