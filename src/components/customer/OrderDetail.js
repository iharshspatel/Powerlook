import React, { Component } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { isAuth, currencyFormat, utcToLocal } from "../../utilities";
import { fetchOrderDetail, downloadInvoice } from "../../actions/customer";
import Breadcrumb from "../Breadcrumb";
import Header from "../Header";
import FooterCheckout from "../FooterCheckout";
import CancelOrderButton from "./CancelOrderButton";
import OrderStatusHistory from "./OrderStatusHistory";
import TrackingInfo from "./TrackingInfo";
import OrderComments from "./OrderComments";
import OrderListItemProduct from "./OrderListItemProduct";
import OrderListItemProductSkeleton from "./OrderListItemProductSkeleton";

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: { orderNumber: "", shipping: {} },
      id: props.match.params.orderId,
    };
  }

  componentWillMount() {
    if (!isAuth()) {
      this.props.history.push(`/login?redirectTo=${window.location.pathname}`);
    }

    fetchOrderDetail(this.state.id).then((response) => {
      this.setState({
        order: response.data[0],
      });
    });
  }

  downloadInvoice() {
    downloadInvoice(this.state.id);
  }

  render() {
    const { order, id } = this.state;

    if (typeof order.eta !== "undefined" && order.eta != "") {
      if (typeof order.comments !== "undefined" && order.comments.length > 0) {
        order.comments = [
          { color: "red", comment: order.eta },
          ...order.comments,
        ];
      } else {
        order.comment_header = "About your order";
        order.comments = [{ color: "red", comment: order.eta }];
      }
    }

    if (!isAuth()) {
      return null;
    }
    return (
      <div className="main-wrapper">
        <Header />
        <div className="track-order-container">
          <div className="container">
            <Breadcrumb
              data={[
                { link: "/account", label: "My Account" },
                { link: "/account/myorders", label: "My Orders" },
                { label: `ID ${order.orderNumber}` },
              ]}
            />
            <div className="trackorder-block-v">
              <div className="order-details-title">
                <h4>
                  Order Details
                  <a
                    className="invoice-link"
                    href="javascript: void(0);"
                    onClick={this.downloadInvoice.bind(this)}
                  >
                    Download Invoice
                  </a>
                </h4>
                <ul>
                  <li>
                    Ordered on{" "}
                    {order.created_at
                      ? utcToLocal(order.created_at, "DD MMM, YYYY")
                      : ""}
                  </li>
                  <li>Order ID {order.orderNumber}</li>
                </ul>
              </div>
              <div className="row">
                <div className="col-xs-12 col-md-8">
                  {typeof order.items !== "undefined" ? (
                    order.items.map((item) => {
                      return (
                        <OrderListItemProduct item={item} key={item.item_id} />
                      );
                    })
                  ) : (
                    <OrderListItemProductSkeleton count={1} />
                  )}

                  <div className="tracking-section-v">
                    <div className="tracking-head-v">
                      <h3>Tracking</h3>
                      {typeof order.shipment !== "undefined" && (
                        <TrackingInfo data={order.shipment} />
                      )}
                    </div>

                    {<OrderStatusHistory data={order.status} />}
                    {typeof order.comments !== "undefined" &&
                      order.comments.length > 0 && (
                        <OrderComments
                          comments={order.comments}
                          comment_header={order.comment_header}
                        />
                      )}
                  </div>
                  <div className="address-payement-info">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="delivery-address-payment">
                          <div className="priceBlock-base-priceHeader">
                            Delivery Address
                          </div>
                          {typeof order.shipping.firstname !== "undefined" ? (
                            <div className="address-block">
                              <div className="main-addess">
                                <span>
                                  {order.shipping.firstname}{" "}
                                  {order.shipping.lastname}
                                </span>
                                <address>
                                  {order.shipping.street}, {order.shipping.city}{" "}
                                  {order.shipping.region} -{" "}
                                  {order.shipping.postcode}
                                </address>
                                <div className="contact-info">
                                  Contact: {order.shipping.telephone}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="address-block">
                              <div className="main-addess">
                                <p>
                                  <Skeleton width={200} height={16} />
                                </p>
                                <p>
                                  <Skeleton width={200} height={16} />
                                </p>
                                <p>
                                  <Skeleton width={200} height={16} />
                                </p>
                                <p>
                                  <Skeleton width={100} height={16} />
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="payment-mathed-info">
                          <div className="priceBlock-base-priceHeader">
                            Payment Method
                          </div>
                          {typeof order.payment_title !== "undefined" ? (
                            <>
                              <p>{order.payment_title}</p>
                            </>
                          ) : (
                            <>
                              <p>
                                <Skeleton width={200} height={16} />
                              </p>
                              <p>
                                <Skeleton width={200} height={16} />
                              </p>
                              <p>
                                <Skeleton width={200} height={16} />
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-4">
                  <div className="desktop-base-right-cart">
                    <div className="priceBlock-base-container">
                      <div className="priceBlock-base-priceHeader">
                        Order Summary
                      </div>
                      <div className="priceBreakUp-base-orderSummary">
                        <div className="priceDetail-base-row">
                          <span className="s-title">Total MRP</span>
                          <span className="priceDetail-base-value">
                            {currencyFormat(order.subtotal, "INR")}
                          </span>
                        </div>
                        {parseFloat(Math.abs(order.discount_amount)) > 0 && (
                          <div className="priceDetail-base-row">
                            <span className="s-title">Total Discount</span>
                            <span className="priceDetail-base-value priceDetail-base-discount">
                              -{" "}
                              {currencyFormat(
                                Math.abs(order.discount_amount),
                                "INR"
                              )}
                            </span>
                          </div>
                        )}

                        <div className="priceDetail-base-row">
                          <span className="s-title">Estimated Tax</span>
                          <span className="priceDetail-base-value">
                            {currencyFormat(order.tax_amount, "INR")}
                          </span>
                        </div>
                        <div className="priceDetail-base-row">
                          <span className="s-title">Delivery</span>
                          <span className="priceDetail-base-value">
                            {currencyFormat(order.shipping_amount, "INR")}
                          </span>
                        </div>
                        {Math.abs(order.wallet_amount) > 0 && (
                          <div className="priceDetail-base-row">
                            <span className="s-title">Wallet Amount</span>
                            <span className="priceDetail-base-value priceDetail-base-discount">
                              -{" "}
                              {currencyFormat(
                                Math.abs(order.wallet_amount),
                                "INR"
                              )}
                            </span>
                          </div>
                        )}

                        {order.cod_amount > 0 && (
                          <div className="priceDetail-base-row">
                            <span className="s-title">COD Fee</span>
                            <span className="priceDetail-base-value">
                              {currencyFormat(order.cod_amount, "INR")}
                            </span>
                          </div>
                        )}

                        <div className="priceDetail-base-row order-total-v">
                          <span className="s-title">Order Total</span>
                          <span className="priceDetail-base-value">
                            {currencyFormat(order.grand_total, "INR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    {typeof order.returnable !== "undefined" &&
                      order.returnable === true && (
                        <div className="action-v-right">
                          <Link
                            to={`/account/rma/new/${id}`}
                            className="btn-fil-primary"
                          >
                            <img src="/assets/images/refresh-primary-white.svg" />
                            <span>Return/Exchange</span>
                          </Link>
                        </div>
                      )}

                    {order.cancelable === true &&
                      (order.status != "rejected_by_admin" && (
                        <div className="cancel-block">
                          <CancelOrderButton orderId={id} orderDetail={this.state.order} />
                        </div>
                      ))}

                    {order.status == "delivered" &&
                      order.cancelable !== true &&
                      !(
                        typeof order.returnable !== "undefined" &&
                        order.returnable === true
                      ) ? (
                      <p>
                        This order cannot be return/exchange, as it has crossed
                        the allowed return period.
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterCheckout />
      </div>
    );
  }
}

export default OrderDetail;
