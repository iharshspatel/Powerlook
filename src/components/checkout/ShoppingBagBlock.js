import React, { Component } from "react";
import { connect } from "react-redux";
import ShoppingBagItem from "./ShoppingBagItem";
import { getCart } from "../../actions/cart";
import CartSubTotal from "./CartSubTotal";
import SingleCartItemSkeleton from "./SingleCartItemSkeleton";
import { isMobile, trackwebEngageEvent } from "../../utilities";
import NoticeBox from "../NoticeBox";
import { CART_VIEWD, MEDIA_BASE } from "../../constants";

class ShoppingBagBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cart: props.cart,
      status: props.status,
      track: true,
    };
  }

  componentDidMount() {
    if (window.gtag)
      window.gtag("event", "conversion", {
        send_to: "AW-767793026/ryEXCM28oNcBEIKvju4C",
      });
  }

  componentDidUpdate() {
    const { cart } = this.state;

    if (
      cart.items &&
      cart.items.length > 0 && this.state.track
    ) {
      const cartData = cart.items;
      const product_details = [];
      cartData.map((product) => {
        const ob = {};
        ob["Product ID"] = `${product.extension_attributes.skuu}`;
        ob["Product Name"] = product.name;
        ob["Category Name"] = product.extension_attributes.category;
        ob["Category Id"] = product.extension_attributes.id;
        ob["Quantity"] = product.qty ? product.qty : 1;
        ob["Retail Price"] = Number(product.price);
        ob["Discount"] = product.discount_amount ? product.discount_amount : 0;
        ob["Price"] = Number(product.base_price_incl_tax);
        ob["Size"] = product.extension_attributes.skuu
          ? product.extension_attributes.skuu
          : "";
        ob["Image"] = [product.extension_attributes.image ? `${MEDIA_BASE}/catalog/product/${product.extension_attributes.image}` : ""];
        ob["Currency"] = "INR";
        product_details.push(ob);
      });

      const cartViewObj = {
        "No. Of Products": product_details.length,
        "Total Amount": Number(cart.base_grand_total),
        "Product Details": product_details,
      };
      trackwebEngageEvent(CART_VIEWD, cartViewObj);
      this.setState({
        ...this.state,
        track: false,
      })
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.compName == "cart" && this.state.status != nextProps.status) {
      this.setState({
        cart: nextProps.cart,
        status: nextProps.status,
      });
    }
  }

  render() {
    const { cart } = this.state;
    return (
      <div className="col-sm-8 itemBlock-base-leftBlock">
        <NoticeBox />
        <div className="cart-total-head">
          <h3>Shopping Cart ({cart.items_qty} Items)</h3>
          {cart.items_qty > 0 && !isMobile() && <CartSubTotal />}
        </div>
        {cart.items_qty > 0 ? (
          <div className="cart-item-block">
            {cart.items.map((item) => {
              return <ShoppingBagItem key={item.item_id} item={item} />;
            })}
          </div>
        ) : (
          <div className="cart-item-block">
            <SingleCartItemSkeleton count={2} />
          </div>
        )}
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    cart: { ...state.Cart.cart },
    status: state.Cart.status,
    compName: state.Cart.compName,
  };
};

export default connect(mapStatesToProps, { getCart })(ShoppingBagBlock);
