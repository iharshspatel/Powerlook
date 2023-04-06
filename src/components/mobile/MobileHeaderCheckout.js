import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import AccountLink from '../AccountLink';

class MobileHeader extends Component {

    render() {
        return (
            <div className="header-mob">
                <div className="mobile-left">
                   <Link to="/" className="mob-logo">
                        <img src="/assets/images/mobile-logo.svg" width="34" height="34" alt="Powerlook" />
                   </Link>
                </div>
                <div className="mob-cart-header-step">
                        <AccountLink />
                </div>
             </div>
        );
    }
}

export default MobileHeader;
