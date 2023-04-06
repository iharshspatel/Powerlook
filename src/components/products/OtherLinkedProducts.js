import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class OtherLinkedProducts extends Component {

  constructor(props){
    super(props);

    this.state = {
      products: props.products
    };
  }


  render() {
    const {products} = this.state;
    if(!products.length)
      return null;

    return (
        <div className="attributes-block other-linked-products">
           <h4 className="title-sm">More Colors</h4>
           <div className="linked-products-block">
              <ul>
                {
                  products.map((product, index) => {
                    return (
                        <li key={index}>
                            <Link to={`/shop/${product.category}/${product.url_key}`}>
                              <img src={product.thumbnail} alt={product.sku} />
                            </Link>
                        </li>
                      )
                  })
                }
              </ul>
           </div>
        </div>
    );
  }
}

export default OtherLinkedProducts;
