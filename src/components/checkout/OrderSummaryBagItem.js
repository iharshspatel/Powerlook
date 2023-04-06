import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import {Link} from 'react-router-dom';
import {MEDIA_BASE} from '../../constants';
import {currencyFormat, percentDiscount} from '../../utilities';
import QuantityBox from '../QuantityBox';
import RemoveFromCartButton from '../products/RemoveFromCartButton';
import OrderListItemProductAttributes from '../customer/OrderListItemProductAttributes';
import {getCart, updateCart} from '../../actions/cart';
import {fetchShippingInformation} from '../../actions/checkout';

class OrderSummaryBagItem extends Component {

  constructor(props){
    super(props);
  }

   updateCart(qty){
       // Create item payload to add it into the cart
      const payload = {
         cartItem: {
           qty
         }
      };
      updateCart(payload, this.props.item.item_id).then(response => {
         this.props.getCart('cart_updated');
      }).catch(error => {
         alert(error.response.data.message);
      });
   }

  render() {
    const {item} = this.props;
    const price = parseFloat(item.extension_attributes.original_price).toFixed(2);
    const finalPrice = parseFloat(item.price_incl_tax).toFixed(2);
    const productAttrs = typeof item.options !== 'undefined' && item.options ? JSON.parse(item.options) : null;
    return (
        <div className="product-list-v2 product-item">
             <figure>
                <Link to={`/shop/${item.extension_attributes.category}/${item.extension_attributes.url_key}`}>
                   {
                      typeof item.extension_attributes.image !== 'undefined'
                      &&
                      <img src={`${MEDIA_BASE}/catalog/product/${item.extension_attributes.image}`} alt="" />
                   } 
                </Link>
             </figure>
             <figcaption className="product-deatil-v2">
                <h3>
                   <Link to={`/shop/${item.extension_attributes.category}/${item.extension_attributes.url_key}`}>{item.name}</Link>
                   {
                       productAttrs !== null
                       &&
                       <div className="all-product-disc product-attr" style={{marginTop: '4px'}}>
                          <OrderListItemProductAttributes attrs={productAttrs} />
                       </div>
                    }
                </h3>
                
                <QuantityBox showInStock={true} label="Qty" smallBtn={true} selected={item.qty} min={1} max={item.extension_attributes.in_stock} callback={this.updateCart.bind(this)} />
                <div className="price-discription">
                  {
                      finalPrice > 0
                      &&
                      price != finalPrice
                      ?
                      <>
                         <div className="price">{currencyFormat(item.row_total_incl_tax, 'INR')}</div>
                         <div className="real-price">{currencyFormat(price * item.qty, 'INR')}</div>
                         <div className="discount-price-percentage">({percentDiscount(price, finalPrice)}% OFF)</div>
                      </>
                      :
                      <div className="price">{currencyFormat(item.row_total_incl_tax, 'INR')}</div>
                   }
                </div>
                <div className="remove-option">
                   <RemoveFromCartButton item_id={item.item_id} label="Remove" item={item} customClassName="cls-remove" />
                </div>
             </figcaption>
          </div>
    );
  }
}

export default connect(null, {getCart, fetchShippingInformation})(OrderSummaryBagItem);