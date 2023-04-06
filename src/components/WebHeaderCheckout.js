import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import {NavLink, Link} from 'react-router-dom';
import { withRouter } from "react-router";
import AccountLink from './AccountLink';

class WebHeaderCheckout extends Component {

    constructor(props){
      super(props);
      this.state = {
        step: props.step,
        status: props.status
      };
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.compName == 'checkoutStep' && this.state.status != nextProps.status){
        this.setState({
          step: nextProps.step,
          status: nextProps.status
        });
      }
    }

    componentDidMount(){
        const ref = this.refs.webheaderCheckout;
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
        const {step} = this.state;

        return (
            <div className="header-web" ref="webheaderCheckout">
                <div className="sticky-header"></div>
                <header className="header-main step-header">
                   <div className="header-main-block text-center">
                      <div className="container">
                         <div className="logo">
                            <Link to="/">
                                <img src="/assets/images/web-logo.svg" width='150' height='34' alt="Powerlook" />
                            </Link>
                         </div>
                         <AccountLink />

                      </div>
                   </div>
                </header>
             </div>
        );
    }
}

const mapStatesToProps = (state) => {
  return {
    step: state.Checkout.step,
    status: state.Checkout.status,
    compName: state.Checkout.compName
  }
}

export default connect(mapStatesToProps)(WebHeaderCheckout);
