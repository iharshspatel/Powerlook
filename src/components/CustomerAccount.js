import React, { Component, Suspense } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { isAuth } from '../utilities';
import { ROUTES } from '../routes';
import ContentLoader from './ContentLoader';
import CustomerAccountLeftNavigation from './customer/CustomerAccountLeftNavigation';

class CustomerAccount extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!isAuth()) {
      this.props.history.push(`/login?redirectTo=${window.location.pathname}`);
    }
  }

  addLeftNav() {
    const $ = window.$$;
    $('#mobile-left-navigation').addClass('profile-toggle-active');
  }

  removeLeftNav() {
    const $ = window.$$;
    $('#mobile-left-navigation').removeClass('profile-toggle-active');
  }

  render() {
    const customClass = this.props.match.isExact ? '' : 'profile-toggle-active';

    if (!isAuth()) {
      return null;
    }
    return (
      <div className="main-wrapper">
        <Header />
        <div id="mobile-left-navigation" className={`block-profile-tabs ${customClass}`}>
          <div className="container">
            <div className="left-section-tabs">
              <CustomerAccountLeftNavigation toggleLeftNav={this.addLeftNav} />
            </div>
            <div className="tabs-content-ui">
              <div className="backprofile-btn">
                <a href="javascript:void(0);" className="go-back backprofile" onClick={this.removeLeftNav}>
                  <i className="icon-arrow-left"></i>
                  <span>My account</span>
                </a>
              </div>
              <div className="tab-pane fade in active-mob-tab active show">
                <div className="block-order-container">
                  <Suspense fallback={<ContentLoader />}>
                    <Switch>
                      <Route {...ROUTES.VIEWPROFILE} />
                      <Route {...ROUTES.EDITPROFILE} />
                      <Route {...ROUTES.RMALIST} />
                      <Route {...ROUTES.SAVEDADDRESSES} />
                      <Route {...ROUTES.MYWALLET} />
                      <Route {...ROUTES.ORDERSLIST} />
                      <Route {...ROUTES.WISHLIST} />
                      <Route {...ROUTES.CHANGEPASSWORD} />
                    </Switch>
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        {/* seoContent={meta_data} */}
      </div>
    );
  }
}

export default CustomerAccount;
