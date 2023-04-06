import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class EmptyCategoryProductsBlock extends Component {

  render() {

    return (
        <div className="block-listing empty-product">
             <div className="completeOrderContainer pad-tp-60">
                <img src="/assets/images/preview-chat-hangerimg.png" alt="" />
                <div className="empty-heading empty-headr-heading">Sorry, This category have no products</div>
                <div className="empty-headr-paragraph">Let’s us help you to find something to wear!</div>
                <div className="search-block-width">
                 <input type="text" placeholder="Search for products" />
                 <span className="icon-search"></span>
                </div>
                <p>Or return to the <Link className="link" to="/">Homepage</Link> and start again.</p>
             </div>
          
       </div>
    );
  }
}

export default EmptyCategoryProductsBlock;
