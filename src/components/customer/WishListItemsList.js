import React, { Component } from 'react';
import { connect } from 'react-redux';
import OrdersListItem from './OrdersListItem';
import ProductItemCard from '../products/ProductItemCard';
import {fetchWishList} from '../../actions/products';

class WishListItemsList extends Component {
  constructor(props){
    super(props);
    this.state = {
      products: props.wishlist.length > 0 ? props.wishlist : null,
      status: props.status
    };
  }

  componentWillMount(){
    this.props.fetchWishList();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'wishlist' && nextProps.status != this.state.status){
      this.setState({
        products: nextProps.wishlist,
        status: nextProps.status
      });
    }
  }

  render() {
    const {products} = this.state;

    return (
        <div className="block-wishlist-ui">
          <div className="head-tabs">
             <h2>My Wishlist</h2>
          </div>
          <div className="grid-block-product">
            {
              products !== null && products.length > 0
              ?
              <div className="row">
              {
                products.map((item) => {
                  //item.product.price = item.product.type_id == 'configurable' ? item.product.min_price : item.product.price;
                  return <div className="col-sm-3" key={item.wishlist_item_id}>
                    <ProductItemCard {...item.product} meta={true} productId={item.product_id} wishlistItemId={item.wishlist_item_id} />
                  </div>
                })
              }
              </div>
              :
              (
                products === null
                ?
                <div className="no-record" style={{paddingLeft: '15px'}}>Loading... your wishlist</div>
                :
                <div className="no-record" style={{paddingLeft: '15px'}}>No record found!</div>
              )
            }
          </div>
          </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    wishlist: [...state.Customer.wishlist],
    status: state.Customer.status,
    compName: state.Customer.compName
  };
}

export default connect(mapStatesToProps, {fetchWishList})(WishListItemsList);
