import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  currencyFormat,
  percentDiscount,
  getSessionItem,
  trackwebEngageEvent,
} from "../../utilities";
import QuantityBox from "../QuantityBox";
import AddToWishListButton from "../products/AddToWishListButton";
import RemoveFromCartButton from "../products/RemoveFromCartButton";
import OrderListItemProductAttributes from "../customer/OrderListItemProductAttributes";
import { CART_UPDATED, MEDIA_BASE } from "../../constants";
import { updateCart, getCart } from "../../actions/cart";

class ShoppingBagItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: props.cart,
      status: props.status,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.compName == "cart" && this.state.status != nextProps.status) {
      this.setState({
        cart: nextProps.cart,
        status: nextProps.status,
      });
    }
  }

  updateCart(qty) {
    // Create item payload to add it into the cart
    const payload = {
      cartItem: {
        qty,
      },
    };



    updateCart(payload, this.props.item.item_id)
      .then((response) => {
        this.props.getCart('cart_updated');
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }

  render() {
    const { item } = this.props;
    const price = parseFloat(item.extension_attributes.original_price).toFixed(
      2
    );
    const finalPrice = parseFloat(item.price_incl_tax).toFixed(2);
    const productAttrs =
      typeof item.options !== "undefined" && item.options
        ? JSON.parse(item.options)
        : null;
    const xLeft = getSessionItem("x_left");
    return (
      <div className="item-base-item">
        <div className="itemContainer-base-itemLeft">
          <Link
            to={`/shop/${item.extension_attributes.category}/${item.extension_attributes.url_key}`}
          >
            {typeof item.extension_attributes.image !== "undefined" && (
              <img
                src={`${MEDIA_BASE}/catalog/product/${item.extension_attributes.image}`}
                alt=""
              />
            )}
          </Link>
        </div>
        <div className="itemContainer-base-itemRight">
          <div className="itemContainer-base-details">
            <div className="itemContainer-base-itemName">
              <Link
                to={`/shop/${item.extension_attributes.category}/${item.extension_attributes.url_key}`}
              >
                {item.name}
              </Link>
              {productAttrs !== null && (
                <div
                  className="all-product-disc product-attr"
                  style={{ marginTop: "4px" }}
                >
                  <OrderListItemProductAttributes attrs={productAttrs} />{" "}
                  <span>·</span> SKU {item.extension_attributes.skuu}
                </div>
              )}
            </div>

            <QuantityBox
              smallBtn={true}
              selected={item.qty}
              min={1}
              max={item.extension_attributes.in_stock}
              callback={this.updateCart.bind(this)}
              label="QTY"
            />

            <div className="itemComponents-base-availabilityMessage">
              {item.extension_attributes.in_stock == "0" ||
              item.extension_attributes.in_stock == "" ? (
                <span style={{ color: "red" }}>Out of stock</span>
              ) : xLeft &&
                item.extension_attributes.in_stock <= parseInt(xLeft) ? (
                <>
                  <span>Only {item.extension_attributes.in_stock} </span>
                  <span>unit(s) </span>
                  <span>in stock</span>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="itemContainer-price">
              <div className="value-price">
                {finalPrice > 0 && price != finalPrice ? (
                  <>
                    <span className="price-new">
                      {currencyFormat(item.price_incl_tax, "INR")}
                    </span>
                    <span className="old-price">
                      {currencyFormat(price, "INR")}
                    </span>
                    <div className="discount-price-percentage">
                      ({percentDiscount(price, finalPrice)}% OFF)
                    </div>
                  </>
                ) : (
                  <span className="price-new">
                    {currencyFormat(item.price_incl_tax, "INR")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="inlinebutton-base-actions">
            <div className="btn-block">
              <RemoveFromCartButton
                item_id={item.item_id}
                label="Remove"
                item={item}
                customClassName="itemContainer-remove btn-action"
                forSize={productAttrs}
              />
              <AddToWishListButton
                removeFromCart={item.item_id}
                productId={item.extension_attributes.id}
                category={item.extension_attributes.category}
                product={item}
                status={item.extension_attributes.wish_list}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    cart: { ...state.Cart.cart },
    compName: state.Cart.compName,
    status: state.Cart.status,
  };
};

export default connect(mapStatesToProps, { getCart })(ShoppingBagItem);
