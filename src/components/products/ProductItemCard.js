/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastsStore } from 'react-toasts';
import CompactRating from '../CompactRating';
import { Link } from 'react-router-dom';
import AddToWishListButton from './AddToWishListButton';
import { MEDIA_BASE, STARRATING } from '../../constants';
import { currencyFormat, percentDiscount } from '../../utilities';
import { removeFromWishList, fetchWishList } from '../../actions/products';

class ProductItemCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      wishListProcessing: false
    };
    this.removeItemFromWishlist = this.removeItemFromWishlist.bind(this);
  }

  removeItemFromWishlist() {
    const { wishListProcessing } = this.state;
    const { wishlistItemId, productId } = this.props;
    if (wishListProcessing === true)
      return;

    this.setState({
      wishListProcessing: true
    });

    this.props.removeFromWishList(wishlistItemId, productId).then(response => {
      this.setState({
        wishListProcessing: false
      });
      ToastsStore.error('Product has been removed from your wishlist.');
      this.props.fetchWishList('removed');
    }).catch(e => {
      this.setState({
        wishListProcessing: false
      });
    });
  }

  render() {
    const { wishListProcessing } = this.state;
    let { category, url_key, image, price, final_price, name, meta, wishlistItemId, ratingSummary, reviewCounts, is_salable, entity_id, wishlist, productLabel, productLabelBgColor } = this.props;

    let bgGradient =  `linear-gradient(61deg,${productLabelBgColor} 75%,transparent 70%)`
    const productLblStyle = {
      fontSize: '10px',
      position: 'absolute',
      background: bgGradient,
      top: '20px',
      padding: '5px 41px 5px 9px',
      color: '#ffffff',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      left: '0px',
      width: 'auto',
      letterSpacing: '0px'
    }
    
    //category = category.replace(/\:/, '/');
    category = category.split(':')[0];
    final_price = typeof final_price !== 'undefined' ? final_price.toString().replace(',', '') : final_price;

    const overallRatingSummary = typeof ratingSummary !== 'undefined' && ratingSummary ? STARRATING.stars * ratingSummary / 100 : 0;

    const overallReviewCounts = typeof reviewCounts !== 'undefined' && reviewCounts ? parseInt(reviewCounts) : 0;

    const bgColors = ['rgb(255, 237, 243)', 'rgb(244, 255, 249)', 'rgb(255, 242, 223)', 'rgb(229, 241, 255)', 'rgb(240, 237, 255)', 'rgb(237, 253, 255)', 'rgb(255, 237, 237)'];

    return (
      <div className="product-ui-card">
        <div className={`product-item ${typeof is_salable !== 'undefined' && !is_salable ? "ofs-product" : ''}`}>
          <figure>
            <Link style={{ background: bgColors[Math.floor(Math.random() * bgColors.length)] }} className="pro-img" to={`/shop/${category}/${url_key}`}>
              {image !== null ? <img src={`${MEDIA_BASE}/catalog/product/${image}`} alt="" /> : <img src="/assets/images/no-image.png" alt="" />}
            </Link>
            {
              typeof wishlistItemId === 'undefined'
              &&
              typeof entity_id !== 'undefined'
              &&
              <AddToWishListButton  category={category} product={this.props} productId={entity_id} itemStyle="1" status={typeof wishlist !== 'undefined' ? wishlist : false} />
            }
            { typeof productLabel !== 'undefined' && <div style={productLblStyle}>{productLabel}</div> }
          </figure>
          {
            meta === true
            &&
            <figcaption>
              <Link to={`/shop/${category}/${url_key}`}>
                <h4>{name}</h4>
                {
                  typeof final_price !== 'undefined'
                    &&
                    parseFloat(final_price) > 0
                    &&
                    parseFloat(final_price) != parseFloat(price)
                    ?
                    <>
                      <div className="price">{currencyFormat(final_price, 'INR', true, 0)}</div>
                      <div className="real-price">{currencyFormat(price, 'INR', true, 0)}</div>
                      <div className="discount-price-percentage">({percentDiscount(price, final_price)}% OFF)</div>
                    </>
                    :
                    (
                      parseFloat(price) > 0
                        ?
                        <div className="price">{currencyFormat(price, 'INR', true, 0)}</div>
                        :
                        ''
                    )
                }
              </Link>
              {
                typeof wishlistItemId !== 'undefined'
                &&
                <div className="sort-cart-option">
                  <a href="javascript:void(0);" className={`cls-remove loader ${wishListProcessing === true ? "show" : ""}`} onClick={this.removeItemFromWishlist}>Remove</a>
                  <Link to={`/shop/${category}/${url_key}`} className="cls-move-bag">MOVE TO BAG</Link>
                </div>
              }
              <div className="rating-star">
                {
                  overallReviewCounts != '0'
                  &&
                  <CompactRating overallRatingSummary={overallRatingSummary} overallReviewCounts={overallReviewCounts} />
                }

              </div>

            </figcaption>
          }
          {meta === true && typeof is_salable !== 'undefined' && !is_salable && <div className="ofs">Out of Stock</div>}
        </div>
      </div>
    );
  }
}

export default connect(null, { removeFromWishList, fetchWishList })(ProductItemCard);
