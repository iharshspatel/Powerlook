import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MEDIA_BASE } from "../../constants";
import { currencyFormat } from "../../utilities";
import OrderListItemProductAttributes from "./OrderListItemProductAttributes";

class OrderListItemProduct extends Component {
  constructor(props) {
    super(props);
  }

  cancelItem() {
    if (window.confirm("Are you sure to cancel this return item?")) {
      this.props.cancelCallback(this.props.item.item_id);
    }
  }

  render() {
    const { item, cancelCallback } = this.props;
    const isCancelable =
      typeof cancelCallback !== "undefined" &&
      typeof item.is_cancelable !== "undefined" &&
      item.is_cancelable === true;

    return (
      <div
        className={`block-sec-product ${isCancelable ? "cancelable" : ""}`}
        key={item.item_id}
      >
        <figure>
          {item.product_exists === true ? (
            <Link to={`/shop/${item.category}/${item.url_key}`}>
              {item.thumbnail.match(/^http/) !== null ? (
                <img src={`${item.thumbnail}`} alt="" />
              ) : (
                <img
                  src={`${MEDIA_BASE}/catalog/product/${item.thumbnail}`}
                  alt=""
                />
              )}
            </Link>
          ) : (
            <a href="javascript: void();">
              <img
                src={`${item.thumbnail}`}
                alt=""
                style={{ objectPosition: "top left" }}
              />
            </a>
          )}
        </figure>
        <figcaption>
          {item.product_exists === true ? (
            <Link to={`/shop/${item.category}/${item.url_key}`}>
              {item.name}
            </Link>
          ) : (
            <a href="javascript: void();">{item.name}</a>
          )}

          <div className="all-product-disc">
            {currencyFormat(item.price, "INR")}{" "}
            <OrderListItemProductAttributes attrs={item.product_options} /> ·{" "}
            {parseInt(item.qty_ordered)} Item(s) · SKU {item.sku}
          </div>
          {typeof item.disabled !== "undefined" && item.disabled === true && (
            <p style={{ color: "red", fontSize: "12px" }}>{item.disableText}</p>
          )}
          {isCancelable && (
            <div>
              <a
                href="javascript:void(0);"
                class="btn-border-secondary cancel-rma-item"
                onClick={this.cancelItem.bind(this)}
              >
                Cancel
              </a>
            </div>
          )}
        </figcaption>
      </div>
    );
  }
}

export default OrderListItemProduct;
