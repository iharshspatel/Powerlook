import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { ToastsStore } from "react-toasts";
import { cancelTheOrder, fetchOrderDetail } from "../../actions/customer";
import { trackwebEngageEvent } from "../../utilities";
import Modal from "../Modal";
import { ORDER_CANCELLED } from '../../constants';
class CancelOrderButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false,
      reasons: [],
      showing: false,
      fields: {},
      errors: {},
      btnDisable: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submituserRegistrationForm =
      this.submituserRegistrationForm.bind(this);

    this.toggleProcessing = this.toggleProcessing.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.resetModal = this.resetModal.bind(this);

    fetchOrderDetail(this.props.orderId)
      .then((response) => {
        this.state.reasons = response.data[0].cancel_reasons;
      })
      .catch((error) => {
        ToastsStore.error(error.response.data.message);
      });
  }

  toggleProcessing() {
    const { processing } = this.state;
    this.setState({
      processing: !this.state.processing,
    });
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields,
    });
  }

  showModal() {
    this.setState({ showing: true });
  }
  hideModal() {
    this.setState({ showing: false });
    this.props.onHide();
  }
  resetModal() {
    let fields = {};
    fields["comments"] = "";
    fields["reasons"] = "";
    this.setState({ fields: fields });
  }

  submituserRegistrationForm(e) {
    e.preventDefault();
    if (this.validateForm()) {
      if (this.state.processing === true) return;

      const request = {
        orderid: +this.props.orderId,
        cancel_reasons: this.state.fields["reasons"],
        cancel_comment: this.state.fields["comments"],
      };
      this.toggleProcessing();
      const { orderDetail } = this.props;
      const cartData = orderDetail.items;
      const product_details = [];
      cartData.forEach((product) => {
        const ob = {};
        const discount = product.price - product.row_total;
        // console.log('test',product)
        // var specificValuesFromArray = product.product_options.filter(obj => obj.label == "Size");
        // console.log('test',specificValuesFromArray.value)
        ob["Product ID"] = `${product.sku}`;
        ob["Product Name"] = product.name;
        ob["Category Name"] = product.category;
        ob["Category Id"] = '';
        ob["Quantity"] = product.qty_ordered;
        ob["Retail Price"] = parseFloat(product.row_total);
        ob["Discount"] = parseFloat(discount.toFixed(2));
        ob["Price"] = Number(parseFloat(product.price));
        ob["Size"] = product.sku
          ? product.sku
          : "";
        ob["Image"] = [product.thumbnail];
        ob["Currency"] = "INR";
        ob["Order ID"] = orderDetail.orderNumber;
        product_details.push(ob);
      });


      cancelTheOrder(this.props.orderId, request)
        .then((response) => {
          if (response.data.statusCode === "300") {
            ToastsStore.error(response.data.message);
          } else {
            trackwebEngageEvent(ORDER_CANCELLED, {
              "Cancellation Reason": request.cancel_reasons ? request.cancel_reasons : '',
              "Order Amount": orderDetail.grand_total ? parseFloat(orderDetail.grand_total) : 0,
              "Product Details": product_details,
            })

            ToastsStore.success(response.data.message);
          }
          // Reload the cart
          this.props.history.push("/account/myorders");
          this.setState({
            showing: false,
            btnDisable: true,
          });
          window.getFooter().setState({
            renderElement: null,
          });
          this.resetModal();
        })
        .catch((error) => {
          ToastsStore.error(error.response.data.message);
          // Enable the button
          this.toggleProcessing();
          this.setState({
            showing: false,
          });
        });
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    /*  if (!fields["comments"]) {
      formIsValid = false;
      errors["comments"] = "Please add comments";
    } */

    if (!fields["reasons"]) {
      formIsValid = false;
      errors["reasons"] = "Please select cancel reason";
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  render() {
    const { processing, showing, btnDisable } = this.state;

    return (
      <div>
        <a
          href="javascript:void(0);"
          className={`btn-fil-primary cancel-link load ${processing ? "show" : ""
            }`}
          onClick={this.showModal}
        >
          Cancel Order
        </a>

        {showing ? (
          <Modal
            id="CancelOrder-modal"
            show={true}
            onHide={this.hideModal}
            dialogClass="modal-660 centerModal"
            header={
              <>
                <div className="pl-3 pr-3 pt-0">
                  <h4>Are you sure you want to cancel order?</h4>
                  <hr className="divider m-0 pt-1" />
                </div>
              </>
            }
            body={
              <div className="address-fields pl-3 pr-3 pt-2">
                <form
                  method="post"
                  name="userRegistrationForm"
                  onSubmit={this.submituserRegistrationForm}
                >
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="fields-block">
                        <label className="title required d-flex">
                          Cancel Reasons
                        </label>
                        <select
                          value={this.state.fields.reasons}
                          onChange={this.handleChange}
                          id="reasons"
                          className="form-control form-select"
                          name="reasons"
                        >
                          <option value="">Select a reasons</option>
                          {
                            Object.keys(this.state.reasons).map((d) => {
                              return (
                                <option key={d} value={this.state.reasons[d].filetype}>{this.state.reasons[d].filetype}</option>
                              )
                            })
                          }
                        </select>
                        <div className="error-text float-left">
                          {this.state.errors.reasons}
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="fields-block">
                        <label className="title d-flex">Comment</label>
                        <textarea
                          placeholder="Not Needed"
                          id="comments"
                          className="form-control"
                          name="comments"
                          value={this.state.fields.comments}
                          onChange={this.handleChange}
                        ></textarea>
                        {/*       <div className="error-text float-left">
                          {this.state.errors.comments}
                        </div> */}
                      </div>
                    </div>
                    <div className="col-sm-12 m-0 p-2 float-left">
                      <span
                        style={{ fontSize: "12px" }}
                        className="filter-input"
                      >
                        In such cases, the order will be cancelled and the money
                        will be refunded to you within 24-48 business hours
                        after the cancellation request.
                      </span>
                    </div>
                  </div>

                  <div className="btn-block-form p-0 pt-2 pb-2 d-flex modalFooterCenter">
                    <button
                      disabled={btnDisable}
                      className={`btn-fil-primary large-btn saveprofile-btn vam loading ${processing ? "show btn-disabled" : ""
                        }`}
                      type="submit"
                    >
                      Submit
                    </button>
                    <button
                      className="btn-border-secondary large-btn cancel-btn vam"
                      onClick={this.resetModal}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            }
          />
        ) : null}
      </div>
    );
  }
  /*   render() {
      const {processing} = this.state;

        return (
        <a href="javascript:void(0);" className={`btn-fil-primary cancel-link load ${processing ? "show" : ""}`} onClick={this.cancelOrder.bind(this)}>Cancel Order</a>
        );
    } */
}

export default withRouter(CancelOrderButton);
