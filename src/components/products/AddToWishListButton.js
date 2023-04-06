import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import {ToastsStore} from 'react-toasts';
import {moveToWishList, moveToWishListSuccess, removeFromWishList, fetchWishList} from '../../actions/products';
import {isAuth, getSessionItem, setSessionItem, trackwebEngageEvent, percentDiscount} from '../../utilities';
import LoginModal from '../user/LoginModal';
import {deleteItemFromCart, getCart} from '../../actions/cart';
import { ADD_TO_WISHLIST } from '../../constants';

class AddToWishListButton extends Component {

  constructor(props){
    super(props);
    this.state = {
      status: props.status,
      authStatus: props.authStatus,
      processing: false,
      productId: props.productId,
      wishlistItemId: 0,
      product:props.product,
      qty: props.qty,
      discount: props.discount,
      category:props.category,
      selectedSize: props.selectedSize,
    };
   
    this.clickHandler = this.clickHandler.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
    this.removeItemFromWishlist = this.removeItemFromWishlist.bind(this);
  }

  clickHandler(){
    const {status} = this.state;
    if(status == true){
      this.removeItemFromWishlist();
      return;
    }

    if(this.state.processing === true)
      return;

    const {productId , product , category} = this.state;
    if(!isAuth()){
      window.getFooter().setState({
        renderElement: <LoginModal onHide={this.hideModal.bind(this)} />
      });
    }else{
      // Disable the button
      this.setState({
        processing: true
      });

     
      // Move to wishlist api
      moveToWishList(productId).then(response => {
        const user = getSessionItem('user');
        const wishlistItem = response.data[0];
        if(typeof user.mywishlist === 'undefined'){
          user.mywishlist = [wishlistItem];
        }else{
          user.mywishlist = [...user.mywishlist, wishlistItem];
        }
        setSessionItem('user', user);

        this.props.moveToWishListSuccess(wishlistItem, productId);

        ToastsStore.success('Product has been added in your wishlist.');
        this.props.fetchWishList('added_to_wishlist');
        if(typeof this.props.removeFromCart !== 'undefined'){
          deleteItemFromCart(this.props.removeFromCart).then(response => {
             this.props.getCart();
          });
        }else{
          this.setState({
            status: true,
            wishlistItemId: response.data[0] !== null ? response.data[0].wishlist_item_id : 0,
            processing: false
          });
        }
        //deleteItemFromCart();
        
      });
    }
  }

  removeItemFromWishlist(){
    const {processing, wishlistItemId, productId} = this.state;
    if(processing === true)
      return;

    this.setState({
      processing: true
    });

    this.props.removeFromWishList(wishlistItemId, productId).then(response => {
      this.setState({
        status: false,
        processing: false
      });
      ToastsStore.error('Product has been removed from your wishlist.');
      this.props.fetchWishList();
    }).catch(e => {
      this.setState({
        processing: false
      });
    });
  } 

  hideModal(){
      window.getFooter().setState({
          renderElement: null
      });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.authStatus != this.state.authStatus && nextProps.compName == 'auth'){
      this.checkStatus();
    }
    if(nextProps.productId != this.state.productId){
      this.setState({
          status: nextProps.status,
          productId: nextProps.productId
      });
      setTimeout(this.checkStatus, 100);
    }
  }

  componentWillMount(){
    this.checkStatus();
  }

  checkStatus(){
    if(isAuth()){
      const user = getSessionItem('user');
      const {productId} = this.state;
      if(user.mywishlist){
        const wlist = user.mywishlist.filter(l => l.product_id == productId);
        if(wlist.length > 0){
          this.setState({
            status: true,
            wishlistItemId: wlist[0].wishlist_item_id
          });
        }
      }
    }
  }

  render() {
    const {status, processing} = this.state;
    const {itemStyle} = this.props;
    let component = null;
    
    // if(status == true && itemStyle != '1')
    //   return null;

    switch(itemStyle){
      case '1':
        component = <a href="javascript:void(0);" onClick={this.clickHandler} className={`heart-btn save-option ${status == true ? "saved" : ""}`}><span className="icon-like"></span></a>;
        break;

      case '2':
        component = status === true ? <Link to="/account/mywishlist" className="border-btn-primary addtobagbtn btn-load">Wishlisted</Link> : <a href="javascript:void(0);" onClick={this.clickHandler} className={`border-btn-primary addtobagbtn btn-load loading  ${processing ? "show" : ""}`}>Add To Wishlist</a>;
        break;

      default:
        component = status === true ? <Link to="/account/mywishlist" className="itemContainer-remove btn-action">Wishlisted</Link> : <a href="javascript:void(0)" onClick={this.clickHandler} className={`itemContainer-wishlist btn-action loader ${processing ? "show" : ""}`}>MOVE TO WISHLIST</a>;
    }
    return component;
  }
}

const mapStatesToProps = (state) => {
    return {
        authStatus: state.Auth.status,
        compName: state.Auth.compName
    }
}

export default connect(mapStatesToProps, {moveToWishListSuccess, fetchWishList, removeFromWishList, getCart})(AddToWishListButton);