import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteItemFromCart, getCart } from '../../actions/cart';
import { MEDIA_BASE, REMOVED_FROM_CART } from '../../constants';
import { trackwebEngageEvent } from '../../utilities';

class RemoveFromCartButton extends Component {

   constructor(props) {
      super(props);
      this.state = {
         processing: false,
         cart: props.cart,
         status: props.status,
         item: props.item,
         forSize: props.forSize,
      };

   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.compName == 'cart' && this.state.status != nextProps.status) {
         this.setState({
            cart: nextProps.cart,
            status: nextProps.status
         });
      }
   }


   removeItemFromCart() {

      // webEngage event product details object
      const { item } = this.props;
      const imgArr = [];
      let sizeOption = Object.keys(this.state.forSize).find(c => this.state.forSize[c].label === 'Size')
      let value = this.state.forSize[sizeOption].value;
      const productDetail = {
         "Product ID": item.extension_attributes.skuu,
         "Product Name": item.name,
         "Category Name": item.extension_attributes.category ? item.extension_attributes.category : '',
         "Category ID": item.extension_attributes.id,
         "Retail Price": Number(item.price),
         "Discount": item.discount_percent ? Number(item.discount_percent) : 0,
         "Price": Number(item.row_total_incl_tax),
         "Currency": "INR",
         "Quantity": item.qty,
         "Size": value ? value : '',
         "Stock": item.extension_attributes.in_stock ? item.extension_attributes.in_stock : 0,
         "Image": item.extension_attributes.image ? `${MEDIA_BASE}/catalog/product/${item.extension_attributes.image}` : imgArr,
      };
      // console.log("test",productDetail)
      this.setState({
         processing: true
      });
      deleteItemFromCart(this.props.item_id).then(response => {

         const productItems = [];
            
         productItems.push({
            'item_id': item.extension_attributes.skuu,
            'item_name': item.name,
            'discount': item.discount_percent ? Number(item.discount_percent) : 0,
            'item_category': item.extension_attributes.category ? item.extension_attributes.category : '',
            'price': Number(item.row_total_incl_tax),
            'quantity': item.qty
         });
         
         if (window.gtag) {
            window.gtag('event', 'remove_from_cart', {
               'currency': "INR",
               'value': item.row_total_incl_tax,
               'items': productItems
            });
         }
         
         trackwebEngageEvent(REMOVED_FROM_CART, productDetail)
         this.setState({
            processing: false
         });

         this.props.getCart();
      }).catch(error => {
         this.setState({
            processing: false
         });
         console.log(error.response.data.message);
      });
   }

   render() {
      const { customClassName, label } = this.props;
      const { processing } = this.state;

      return (
         <a href="javascript:void(0)" className={`${customClassName} loader ${processing === true ? "show" : ""}`} onClick={this.removeItemFromCart.bind(this)}>{label}</a>
      );
   }
}
const mapStatesToProps = (state) => {
   return {
      cart: { ...state.Cart.cart },
      compName: state.Cart.compName,
      status: state.Cart.status,
   }
}

export default connect(mapStatesToProps, { getCart })(RemoveFromCartButton);
