import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import MainNavigation from './MainNavigation';
import TopNavigation from './TopNavigation';
import ProductSearch from './ProductSearch';
import CartPreview from './cart/CartPreview';

class WebHeader extends Component {

    componentDidMount(){
        const ref = this.refs.webheader;
        setTimeout(() => this.addStickyHeader(ref), 100);
    }

    addStickyHeader(ref){
      const $ = (selector) => window.$$(ref).find(selector);
      const offset = $('.header-main-block').offset().top;
      window.$$(window).unbind('scroll').bind('scroll', function() {
        const headHeight = $('.header-main-block').innerHeight();
          if (window.$$(this).scrollTop() > offset){  
              $('.header-main').addClass("sticky");
              $('.sticky-header').addClass("show-sticky");
              $('.sticky-header').css('height',headHeight);
          }
          else{
              $('.header-main').removeClass("sticky");
              $('.sticky-header').removeClass("show-sticky");
              $('.sticky-header').css('height','0');
          }
      });
    }

    componentWillUnmount(){
        window.$$(window).unbind('scroll');
    }

    render() {
        return (
            <div className="header-web" ref="webheader">
                <div className="header-top">
                    <div className="container">
                        <TopNavigation />
                    </div>
                </div>
                <div className="sticky-header"></div>
                <header className="header-main">
                    <div className="header-main-block text-center">
                        <div className="container">
                            <div className="logo">
                                <Link to="/">
                                    <img src="/assets/images/web-logo.svg" width="150" height="34" alt="Powerlook" />
                                </Link>
                            </div>
                            <div className="block-right-header">
                                <MainNavigation customClassName="navigation-main" />
                                <ProductSearch />
                                <div className="wishlist-block">
                                  <Link className="active" to="/account/mywishlist"><i className="ic"><img src="/assets/images/heart.svg" width="22" alt="Wishlist" /></i></Link>
                                </div>
                                <div className="cart-block dropdown show">
                                    <CartPreview />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default WebHeader;
