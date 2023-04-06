import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ProductSearch from './ProductSearch';

class PageNotFound extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="main-wrapper">
        <Header />
        <div className="cart-block-container">
          <div className="completeOrderContainer pad-tp-60">
            <div className="empty-heading empty-headr-heading">Sorry, Page not found</div>
            <div className="empty-headr-paragraph">Let’s us help you to find simething to wear!</div>

            <div className="search-block-width">
              <ProductSearch />
            </div>
            <p>Or return to the <Link className="link" to="/">Homepage</Link> and start again.</p>
          </div>
        </div>
        <Footer />
        {/* seoContent={meta_data}  */}
      </div>
    );
  }
}

export default PageNotFound;