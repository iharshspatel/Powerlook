import React, { Component } from "react";
import { connect } from "react-redux";
import OrderSummaryBag from "./OrderSummaryBag";
import Error from "../Error";
import { MEDIA_BASE } from "../../constants";
import { getSessionItem, setSessionItem } from "../../utilities";
import {
  fetchShippingInformationNext,
  updateCheckoutToStep,
  updateCustomerEmail,
} from "../../actions/checkout";

class OrderSummary extends Component {
  constructor(props) {
    super(props);
    const session = getSessionItem("user");
    this.state = {
      cart: props.cart,
      nextStep: props.nextStep,
      status: props.status,
      customerEmail: session ? session.email : null,
      emailError: null,
      processing: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.compName === "checkout" &&
      nextProps.status !== this.state.status &&
      nextProps.nextStep !== this.state.nextStep
    ) {
      const session = getSessionItem("user");
      this.setState({
        cart: nextProps.cart,
        nextStep: nextProps.nextStep,
        status: nextProps.status,
        customerEmail: session ? session.email : null,
        emailError: null,
        processing: false,
      });
    }
  }

  async gotoNextStep(e) {
    e.preventDefault();
    const { customerEmail } = this.state;
    if (customerEmail) {
      let customerEmailId = customerEmail;
      if (this.refs && this.refs.customer_email && this.refs.customer_email.value) {
        customerEmailId = this.refs.customer_email.value
      }
      if (customerEmailId.endsWith("@powerlook.in") && customerEmailId.length > 25) {
        this.setState({
          emailError: "Please enter your email id",
        });
      } else {
        const session = getSessionItem("user");
        session.email = customerEmailId;
        setSessionItem("user", session);
        this.setState({
          emailError: null,
          customerEmail: customerEmail,
        }, () => { this.props.fetchShippingInformationNext(); });
      }
    } else {
      const customerEmailId = this.refs.customer_email.value;
      if (customerEmailId.replace(/\s/, "") == "") {
        this.setState({
          emailError: "Please enter your email id",
        });
      } else {
        this.setState({
          processing: true,
        });
        updateCustomerEmail(customerEmailId)
          .then((response) => {
            const session = getSessionItem("user");
            session.email = response.data[0];
            setSessionItem("user", session);
            this.props.fetchShippingInformationNext();
          })
          .catch((error) => {
            this.setState({
              emailError: error.response.data[0],
              processing: false,
            });
          });
      }
    }
  }

  render() {
    const { nextStep, cart, customerEmail, emailError, processing } =
      this.state;

    return (
      <div className={`block-payment ${nextStep > 3 ? "done-block" : ""}`}>
        <div className="head-block-detail">
          <div className="counter-payment">2</div>
          <h3 className="title-payment">Order Summary</h3>
          {cart.items_qty > 0 && nextStep > 3 && (
            <>
              <div className="right-block-detail">
                <div className="change-option-ui">
                  <a
                    href="javascript:void(0);"
                    className="change-option-text"
                    onClick={() => this.props.updateCheckoutToStep(3)}
                  >
                    Change Order
                  </a>
                </div>
              </div>
              <div className="block-result-detail">
                {cart.items.map((item) => {
                  return (
                    <div
                      key={item.item_id}
                      className="product-preview-container"
                    >
                      <figure>
                        {typeof item.extension_attributes.image !==
                          "undefined" && (
                            <img
                              src={`${MEDIA_BASE}/catalog/product/${item.extension_attributes.image}`}
                              alt=""
                            />
                          )}
                      </figure>
                      <figcaption>
                        <label>{item.name}</label>
                        <p>Qty: {item.qty}</p>
                      </figcaption>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        {nextStep == 3 && (
          <div className="content-block-detail item-summery-option">
            <OrderSummaryBag />
            <div className="btn-block btn-summery-order">
              {customerEmail ? (
                customerEmail.length > 25 &&
                  customerEmail.includes("@powerlook.in") ? (
                  <>
                    <p className="note-summery-order">
                      Please enter your order confirmation email id
                    </p>
                    <div className="add-money-field confirmationEmail">
                      <input
                        className="form-control"
                        type="text"
                        ref="customer_email"
                      />
                      <a
                        href="javascript:void(0);"
                        className={`btn-fil-primary btn-action-payment loading ${processing === true ? "show" : ""
                          }`}
                        onClick={this.gotoNextStep.bind(this)}
                      >
                        Continue
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="note-summery-order">
                      Order confirmation email will be sent to{" "}
                      <strong>{customerEmail}</strong>
                    </p>
                    <a
                      href="javascript:void(0);"
                      className={`btn-fil-primary btn-action-payment loading ${processing === true ? "show" : ""
                        }`}
                      onClick={this.gotoNextStep.bind(this)}
                    >
                      Continue
                    </a>
                  </>
                )
              ) : (
                <>
                  <p className="note-summery-order">
                    Please enter your order confirmation email id
                  </p>
                  <div className="add-money-field confirmationEmail">
                    <form onSubmit={this.gotoNextStep.bind(this)}>
                      <input
                        required
                        className="form-control"
                        type="text"
                        ref="customer_email"
                      />
                      <button
                        type="submit"
                        className={`btn-fil-primary btn-action-payment loading ${processing === true ? "show" : ""
                          }`}
                      >
                        Continue
                      </button>
                    </form>
                    {/* BELOW CODE DEVELOPED BY RUSHIKESH */}
                    {/* <a
                      href="javascript:void(0);"
                      className={`btn-fil-primary btn-action-payment loading ${
                        processing === true ? "show" : ""
                      }`}
                      onClick={this.gotoNextStep.bind(this)}
                    >
                      Continue
                    </a> */}
                  </div>
                </>
              )}
              {/* {
                customerEmail.length > 20 && customerEmail.includes("@powerlook") ? <p>You Don't Have Email</p> : <p>You Have Email</p>
              } */}
              {/* {customerEmail ? (
                <>
                  <p className="note-summery-order">
                    Order confirmation email will be sent to{" "}
                    <strong>{customerEmail}</strong>
                  </p>
                  <a
                    href="javascript:void(0);"
                    className={`btn-fil-primary btn-action-payment loading ${
                      processing === true ? "show" : ""
                    }`}
                    onClick={this.gotoNextStep.bind(this)}
                  >
                    Continue
                  </a>
                </>
              ) : (
                <>
                  <p className="note-summery-order">
                    Please enter your order confirmation email id
                  </p>
                  <div className="add-money-field confirmationEmail">
                    <input
                      className="form-control"
                      type="text"
                      ref="customer_email"
                    />
                    <a
                      href="javascript:void(0);"
                      className={`btn-fil-primary btn-action-payment loading ${
                        processing === true ? "show" : ""
                      }`}
                      onClick={this.gotoNextStep.bind(this)}
                    >
                      Continue
                    </a>
                  </div>
                </>
              )} */}
              {emailError !== null && <Error text={emailError} />}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    nextStep: state.Checkout.nextStep,
    cart: { ...state.Cart.cart },
    status: state.Checkout.status,
    compName: state.Checkout.compName,
  };
};

export default connect(mapStatesToProps, {
  fetchShippingInformationNext,
  updateCheckoutToStep,
})(OrderSummary);
