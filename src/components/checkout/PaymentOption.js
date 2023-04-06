import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { clearCart } from "../../utilities";
import {
  fetchPaymentInfo,
  saveOrderId,
  selectPaymentMethod,
} from "../../actions/checkout";
import { currencyFormat } from "../../utilities";

class PaymentOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: props.selectedOption,
      item: props.item,
      disableOptions: props.disableOptions,
      shippingAddress: props.shippingAddress,
      processing: false,
      btnDisable: false,
      cart: props.cart
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedOption != this.state.selectedOption) {
      this.setState({
        selectedOption: nextProps.selectedOption,
      });
    }

    if (nextProps.disableOptions != this.state.disableOptions) {
      if (nextProps.disableOptions) {
        this.props.selectPaymentMethod(0);
      }
      this.setState({
        disableOptions: nextProps.disableOptions,
      });
    }

    if (nextProps.cart && this.state.status != nextProps.status) {
      this.setState({
        cart: nextProps.cart,
        status: nextProps.status
      });
    }

    if (nextProps && nextProps.order_price_summary && nextProps.order_price_summary.statusCode === "200") {
      this.setState({
        order_summary: nextProps.order_price_summary
      })
    }
  }

  placeOrder() {
    const { mobile, parentRef } = this.props;
    if (this.state.processing === true) return;
    this.setState({
      processing: true,
    });
    parentRef &&
      parentRef.setState({
        processing: true,
      });
    const { item, shippingAddress } = this.state;
    const payload = {
      paymentMethod: {
        method: item.code,
      },
      billing_address: shippingAddress,
    };

    const cartItems = [];    

    if (this.state.cart && this.state.cart.items) {
      this.state.cart.items.map(item => {
        cartItems.push({
          'item_id': `${item.extension_attributes.skuu}`,
          'item_name': item.name,
          'coupon': this.state.usedCoupon ? this.state.usedCoupon.code : "",
          'discount': item.discount_amount ? Number(item.discount_amount) : 0,
          'item_category': item.extension_attributes.category,
          'price': Number(item.base_row_total_incl_tax),
          'quantity': item.qty
        });
      });
    }
    
    if (window.gtag) {
      window.gtag('event', 'add_payment_info', {
        'currency': "INR",
        'value': this.state.order_summary && this.state.order_summary.grand_total ? this.state.order_summary.grand_total.amount : 0,
        'coupon': this.state.usedCoupon ? this.state.usedCoupon.code : "",
        'payment_type': this.state.item ? this.state.item.code : '',
        'items': cartItems
      });
    }

    fetchPaymentInfo(payload)
      .then((response) => {
        const orderId = response.data;
        this.props.saveOrderId(orderId);
        // Clear cart
        this.setState({
          btnDisable: true,
        });
        parentRef &&
          parentRef.setState({
            btnDisable: true,
          });
        clearCart();
        this.props.history.push("/order/success");
      })
      .catch((error) => {
        this.setState({
          processing: false,
        });
        parentRef &&
          parentRef.setState({
            processing: false,
          });
        // Clear cart
        //clearCart();
        //this.props.history.push('/order/cancelled');
      });
  }

  handleSelect(e) {
    const { item } = this.state;
    const codfee =
      typeof item.fee !== "undefined" && item.fee > 0 ? item.fee : 0;
    this.props.onChange(e);
    this.props.selectPaymentMethod(codfee);
    if (typeof this.props.mobile !== "undefined") {
      this.props.mobile(this, false);
    }
  }

  triggerClick(e) {
    const $ = window.$$;
    let target = null;
    $(
      ".list-payment-methods .check-action-block-payment.card-active"
    ).removeClass("card-active");
    if ($(e.target).hasClass("check-action-block-payment")) {
      target = e.target;
    } else {
      target = $(e.target).parents(".check-action-block-payment:eq(0)")[0];
    }
    $(target).addClass("card-active");
    $(target).find("input[type=radio]").trigger("click");
  }

  componentWillUnmount() {
    this.props.selectPaymentMethod(0);
  }

  render() {
    const { item, selectedOption, disableOptions, processing, btnDisable } =
      this.state;

    return (
      <div className="payment-method-block payment-bottom cashdeliver">
        <h6 className="payment-method-title">Cash</h6>
        <div key={item.code} className="list-payment-methods">
          <div
            className="check-action-block-payment"
            onClick={this.triggerClick}
          >
            <div className="head-other-mathod">
              <div className="custom-radio-ui">
                <label>
                  <input
                    disabled={disableOptions}
                    checked={selectedOption == item.code && !disableOptions}
                    onChange={this.handleSelect}
                    defaultValue={item.code}
                    type="radio"
                    className="option-input"
                    name="method"
                  />
                  <span className="filter-input"></span>
                </label>
              </div>
              <div className="block-bank-account-detail">
                <div className="card-name-type">
                  <div className="card-name">
                    <label>
                      <span className="payment-ic-img">
                        <img
                          width="19"
                          src="/assets/images/cod2.png"
                          alt={item.title}
                        />
                      </span>
                      {item.title}
                      {typeof item.fee !== "undefined" && item.fee > 0 ? (
                        <span className="onDeliverContent">
                          On COD additional {currencyFormat(item.fee, "INR")}{" "}
                          fee will be added
                        </span>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div>
                {typeof this.props.mobile === "undefined" &&
                  selectedOption == item.code &&
                  !disableOptions && (
                    <div className="enter-cvv">
                      <button
                        disabled={btnDisable}
                        onClick={this.placeOrder.bind(this)}
                        className={`btn-fil-primary loading ${
                          processing === true ? "show btn-disabled" : ""
                        }`}
                      >
                        Place Order
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    shippingAddress: { ...state.Checkout.progress.shippingAddress },
    cart: { ...state.Cart.cart },
    order_price_summary: state.Cart && state.Cart.order_summary ? state.Cart.order_summary[0] : null
  };
};

export default withRouter(
  connect(mapStatesToProps, { saveOrderId, selectPaymentMethod })(PaymentOption)
);
