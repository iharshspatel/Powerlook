import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ORDERSTATE, ORDERSTATUS } from "../../constants";
import { currencyFormat, utcToLocal } from "../../utilities";
import OrderListItemProduct from "./OrderListItemProduct";

class OrderListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { order, statuses } = this.props;

    const trackOrderStyle = {
      minWidth: "170px"
    }

    const returnExchangeStyle = {
      maxWidth: "170px",
      padding: "0px"
    }

    return (
      <div className="block-list-order-v">
        <div className="head-block-order">
          {order.state !== null && (
            <div className="order-type order-head-devide">
              <label style={{ color: ORDERSTATUS[order.status].color }}>
                {statuses[order.status]}
              </label>
              <p>{ORDERSTATE[order.status]}</p>
            </div>
          )}

          <div className="info-order order-head-devide">
            <label>Total</label>
            <p>
              {currencyFormat(order.grand_total, order.order_currency_code)}
            </p>
          </div>
          <div className="info-order quantity-head order-head-devide">
            <label>Item(s)</label>
            <p>{parseInt(order.total_qty_ordered)}</p>
          </div>
          <div className="order-id-block order-head-devide">
            <label>Order #{order.increment_id}</label>
            <p>Placed on {utcToLocal(order.created_at, "DD MMM, YYYY")}</p>
          </div>
        </div>
        <div className="block-product-detail">
          <div className="product-in-list-v">
            <div className="row">
              <div className="col-sm-8 align-self-center">
                {order.items.map((item) => {
                  return (
                    <OrderListItemProduct item={item} key={item.item_id} />
                  );
                })}
              </div>
              <div className="col-sm-4 align-self-center">
                <div className="btn-block-product text-right">
                  { 
                  order.trackOrderLabel != undefined && order.trackOrderLabel ? (
                    <Link
                      to={`/account/myorders/detail/${order.entity_id}`}
                      className="btn-block-track"
                      style={trackOrderStyle}
                    >
                      <img
                        src="/assets/images/location.svg"
                        alt="Track Order"
                      />
                      <span>Track order</span>
                    </Link>                      
                  )
                  : <></>
                  }

                  <Link
                    to={`/account/myorders/detail/${order.entity_id}`}
                    className="border-btn-arrow"
                    style={trackOrderStyle}
                  >
                    View Details
                  </Link>

                  {typeof order.returnable !== "undefined" &&
                      order.returnable === true && (
                        <div className="action-v-right">
                          <Link
                            to={`/account/rma/new/${order.entity_id}`}
                            className="btn-fil-primary"
                            style={returnExchangeStyle}
                          >
                            <img src="/assets/images/refresh-primary-white.svg" />
                            <span>Return/Exchange</span>
                          </Link>
                        </div>
                      )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderListItem;
