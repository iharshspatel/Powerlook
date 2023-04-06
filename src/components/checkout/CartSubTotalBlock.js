/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { ToastsStore } from 'react-toasts';
import { getCart, getCouponsList, removeCouponCode, verifyCartItemInStock, getOrderSummary } from '../../actions/cart';
import { saveWalletTotalsInfo, updateCustomerEmail, updateUsedCouponCode } from '../../actions/checkout';
import { CHECKOUT_STARTED, COUPAN_CODE_APPLIED, MEDIA_BASE } from '../../constants';
import { currencyFormat, getSessionItem, isAuth, isMobile, setSessionItem, trackwebEngageEvent } from '../../utilities';
import ApplyCouponCode from '../cart/ApplyCouponCode';
import Error from '../Error';
import Modal from '../Modal';
import LoginModal from '../user/LoginModal';

class CartSubTotalBlock extends Component {

  constructor(props) {
    super(props);
    const session = getSessionItem('user');
    this.state = {
      totals: typeof props.cart.total_segments !== 'undefined' ? props.cart.total_segments : {},
      freeShippingMinAmount: typeof props.cart.extension_attributes !== 'undefined' ? props.cart.extension_attributes.free_shipping_min_amount : 0,
      status: props.status,
      authStatus: props.authStatus,
      checkoutStatus: props.checkoutStatus,
      processing: false,
      checkoutProcessing: false,
      CODFee: props.CODFee,
      emailError: '',
      customerEmail: session ? session.email : null,
      usedCoupon: null,
      couponProcessing: false,
      coupanTitle: null,
      checkoutText: props.checkoutText,
      walletTotalAmount: 0
    };

    this.goToCheckout = this.goToCheckout.bind(this);
  }

  componentWillMount() {
    const { cart } = this.props;
    if (typeof cart.items === 'undefined') {
      // If there is no cart in memory
      this.props.getCart();
      this.getCoupanListt();
    }
  }

  getCoupanListt() {
    getCouponsList().then((res) => {
      const usedCoupon = res.data.find(c => c.used);
      this.props.updateUsedCouponCode(usedCoupon)
      this.setState({ ...this.state, usedCoupon });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps && prevProps.order_price_summary && this.props.order_price_summary && this.props.order_price_summary.coupon_discount && prevProps.order_price_summary.coupon_code !== this.props.order_price_summary.coupon_code) {
      let discount = this.props.order_price_summary.coupon_discount.amount;
      discount = Math.abs(discount)
      let afterTotalAmount = this.props.cart.base_grand_total - discount;
      trackwebEngageEvent(COUPAN_CODE_APPLIED, {
        "Cart Value Before Discount": Number(this.props.cart.base_grand_total),
        "Cart Value After Discount": Number(parseFloat(afterTotalAmount.toFixed(2))),
        "Coupon Code": this.props.order_price_summary.coupon_code,
        "Discount Amount": discount,
      });

      
      const productItems = [];
      
      this.props.cart.items.map( item => {
        productItems.push({
          'item_id': `${item.extension_attributes.skuu}`,
          'item_name': item.name,
          'coupon': this.state.usedCoupon ? this.state.usedCoupon.code : "",
          'discount': item.discount_amount ? Number(item.discount_amount) : 0,
          'item_category': item.extension_attributes.category,
          'price': Number(item.base_row_total_incl_tax),
          'quantity': item.qty
        });
      });

      if (window.gtag) {
        window.gtag('event', 'view_promotion', {
            'promotion_name': this.props.order_price_summary.coupon_code,
            'items': productItems
        });
      }
    }
  }




  componentWillReceiveProps(nextProps) {


    let codfee = 0;
    if (nextProps.CODFee > 0) {
      codfee = nextProps.CODFee;
    }
    const session = getSessionItem('user');
    if (nextProps.compName === 'cart' && this.state.status != nextProps.status) {
      this.props.getOrderSummary()
      const t = typeof nextProps.cart.total_segments !== 'undefined' ? { ...nextProps.cart.total_segments, codfee } : {}
      const cName = t && t.discount && t.discount.title ? t.discount.title.split("(")[1] : null;
      this.setState({
        totals: typeof nextProps.cart.total_segments !== 'undefined' ? { ...nextProps.cart.total_segments, codfee } : {},
        coupanTitle: cName ? cName.split(")")[0] : null,
        freeShippingMinAmount: typeof nextProps.cart.extension_attributes !== 'undefined' ? nextProps.cart.extension_attributes.free_shipping_min_amount : 0,
        status: nextProps.status,
        customerEmail: session ? session.email : null,
        processing: false
      });
    } else {
      if (nextProps.compName == 'processing-cart' && this.state.status != nextProps.status) {
        this.setState({
          processing: true,
          customerEmail: session ? session.email : null
        });
      } else {
        if (nextProps.checkoutCompName == 'wallet-calc' && this.state.checkoutStatus != nextProps.checkoutStatus) {
          const tt = { ...nextProps.walletCalc, codfee };
          const cName = tt && tt.discount && tt.discount.title ? tt.discount.title.split("(")[1] : null
          this.setState({
            totals: tt,
            coupanTitle: cName ? cName.split(")")[0] : null,
            checkoutStatus: nextProps.checkoutStatus,
            customerEmail: session ? session.email : null,
            walletTotalAmount: tt.grand_total.value
          });
        }
      }
    }

    if (nextProps && nextProps.order_price_summary && nextProps.order_price_summary.statusCode === "200") {
      this.setState({
        order_summary: nextProps.order_price_summary
      })
    }

    if (!this.state.checkoutText) {
      this.setState({
        checkoutText: nextProps.checkoutText
      })
    }

    if (nextProps.CODFee != this.state.CODFee) {
      const tt = { ...this.state.totals, codfee };
      const cName = tt && tt.discount && tt.discount.title ? tt.discount.title.split("(")[1] : null
      this.setState({
        coupanTitle: cName ? cName.split(")")[0] : null,
        totals: { ...this.state.totals, codfee },
        CODFee: nextProps.CODFee,
        customerEmail: session ? session.email : null
      });
    }
  }

  gotoNextStep() {
    if (this.state.checkoutProcessing === true)
      return;
    // If user is not logged in, show login popup
    if (!isAuth()) {
      window.getFooter().setState({
        renderElement: <LoginModal onHide={this.hideModal.bind(this)} />
      });
    } else {
      if (isMobile()) {
        const { customerEmail } = this.state;
        if (!customerEmail) {
          const customerEmailId = this.refs.customer_email.value;
          if (customerEmailId.replace(/\s/, '') == '') {
            window.$$('html, body').animate({ scrollTop: 100000 }, 1000);
            window.$$(this.refs.customer_email).focus();
            this.setState({
              emailError: 'Please enter your email id'
            });
          } else {
            this.setState({
              checkoutProcessing: true
            });
            updateCustomerEmail(customerEmailId).then(response => {
              const session = getSessionItem('user');
              session.email = response.data[0];
              setSessionItem('user', session);
              this.goToCheckout();
            }).catch(error => {
              this.setState({
                emailError: error.response.data[0],
                checkoutProcessing: false
              });
            });
          }
        } else {
          this.goToCheckout();
        }
      } else {
        this.goToCheckout();
      }
    }
  }

  goToCheckout() {

    // web engage code for checkout started 
    const product_details = [];
    this.props.cart.items.map((product) => {
      const ob = {};
      ob["Product Id"] = `${product.extension_attributes.skuu}`;
      ob["Product Name"] = product.name;
      ob["Category Name"] = product.extension_attributes.category;
      ob["Category Id"] = product.extension_attributes.id;
      ob["Quantity"] = product.qty;
      ob["Retail Price"] = Number(product.price);
      ob["Discount"] = product.discount_amount ? Number(product.discount_amount) : 0;
      ob["Price"] = Number(product.base_price_incl_tax);
      ob["Size"] = product.extension_attributes.skuu
        ? product.extension_attributes.skuu
        : "";
      ob["Image"] = [product.extension_attributes.image ? `${MEDIA_BASE}/catalog/product/${product.extension_attributes.image}` : ""];
      ob["Currency"] = "INR";
      product_details.push(ob);
    });

    try {
      console.log(this.state.usedCoupon)
      const obj = {
        currency: "INR",
        "No. Of Products": this.state.order_summary.item_count || 0,
        "Total Amount": this.state.order_summary.grand_total.amount || 0,
        "Product Name": product_details ? product_details.map(item => item["Product Name"]).join(",") : "",
        "Product Id": product_details ? product_details.map(item => item["Product Id"]).join(",") : "",
        "Category Id": product_details ? product_details.map(item => item["Category Id"]).join(",") : "",
        "Category Name": product_details ? product_details.map(item => item["Category Name"]).join(",") : "",
        "Product Details": product_details,
        "Discount Amount": this.state.totals.discount
          ? Math.abs(this.state.totals.discount.value)
          : 0,
        "Coupon Code": this.state.usedCoupon ? this.state.usedCoupon.code : "",
        "Shipping method": this.state.order_summary.shipping_incl_tax
          ? this.state.order_summary.shipping_incl_tax.label
          : "",
      };
      trackwebEngageEvent(CHECKOUT_STARTED, obj);

      
      const productItems = [];
      
      this.props.cart.items.map( item => {
        productItems.push({
          'item_id': `${item.extension_attributes.skuu}`,
          'item_name': item.name,
          'coupon': this.state.usedCoupon ? this.state.usedCoupon.code : "",
          'discount': item.discount_amount ? Number(item.discount_amount) : 0,
          'item_category': item.extension_attributes.category,
          'price': Number(item.base_row_total_incl_tax),
          'quantity': item.qty
        });
      });

      if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
          'currency': "INR",
          'value': this.state.order_summary && this.state.order_summary.grand_total ? this.state.order_summary.grand_total.amount : 0,
          'coupon': this.state.usedCoupon ? this.state.usedCoupon.code : "",
          'items': productItems
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({
      checkoutProcessing: true,
    });

    // web engage code end for checkout started 

    verifyCartItemInStock().then(() => {
      this.setState({
        checkoutProcessing: false
      });
      this.props.history.push('/checkout');
    }).catch(() => {
      this.props.getOrderSummary()
      this.props.getCart();
      this.setState({
        checkoutProcessing: false
      });
    });
  }

  openApplyCouponCodeModal() {
    window.getFooter().setState({
      renderElement: <Modal
        id="apply-coupon-modal"
        show={true}
        onHide={this.hideModal.bind(this)}
        header={<h4 className="modal-title">Apply Coupon</h4>}
        body={<ApplyCouponCode onHide={this.hideModal.bind(this)} />}
      />
    });
  }



  hideModal() {
    this.getCoupanListt();
    window.getFooter().setState({
      renderElement: null
    });
  }

  removeCouponCodee(e) {
    e.preventDefault();
    const { processing } = this.state;
    if (processing === true)
      return;

    this.setState({
      processing: true
    });

    removeCouponCode().then(response => {
      this.setState({
        processing: false
      });
      ToastsStore.success("Coupon code is removed successfully.");
      // Refresh Totals
      if (typeof response.data[0].totals !== 'undefined') {
        this.props.saveWalletTotalsInfo(response.data[0].totals);
      } else {
        // this.setState({ ...this.state, usedCoupon: null })
        this.props.getCart();
        this.props.getOrderSummary()
      }
      this.hideModal();
    }).catch(error => {
      this.setState({
        processing: false
      });
      console.error("EORRER ", error)
      if (error && error.response && error.response.data && error.response.data[0]) {
        ToastsStore.error(error.response.data[0].message);
      }
      this.hideModal();
    });
  }

  render() {
    const { order_summary, totals, emailError, customerEmail, processing, freeShippingMinAmount, checkoutProcessing, coupanTitle, checkoutText } = this.state;
    const walletAmount = typeof totals.wallet_amount !== 'undefined' ? totals.wallet_amount.value : 0;
    const codfee = typeof totals.codfee !== 'undefined' && totals.codfee > 0 ? totals.codfee : 0;

    return (
      <div className="col-sm-4 desktop-base-right-block">
        <div className="desktop-base-right">
          <div className="priceBlock-base-container">
            <div className="priceBlock-base-priceHeader">{order_summary ? order_summary.title : "Price Detail"}</div>
            {
              order_summary && Object.keys(order_summary).length > 0
                ?
                <div className={`priceBreakUp-base-orderSummary ${processing === true ? "loading-block" : ""}`}>
                  {
                    order_summary.total_mrp ?
                      <div className="priceDetail-base-row">
                        <span className="s-title">{order_summary.total_mrp.label}</span>
                        <span className="priceDetail-base-value">{currencyFormat(order_summary.total_mrp.amount, 'INR')}</span>
                      </div> : null
                  }
                  {
                    order_summary.discount_on_mrp ?
                      <div className="priceDetail-base-row">
                        <span className="s-title">{order_summary.discount_on_mrp.label}</span>
                        <span className="priceDetail-base-value priceDetail-base-discount">- {currencyFormat(Math.abs(order_summary.discount_on_mrp.amount), 'INR')}</span>
                      </div> : null
                  }
                  {
                    order_summary.coupon_discount ?
                      <div className="priceDetail-base-row">
                        <span className="s-title">{order_summary.coupon_discount.label}</span>
                        <span className="priceDetail-base-value priceDetail-base-discount">- {currencyFormat(order_summary.coupon_discount.amount, 'INR')}</span>
                      </div> : null
                  }
                  {
                    order_summary.shipping_incl_tax ?
                      <div className="priceDetail-base-row">
                        <span className="s-title">{order_summary.shipping_incl_tax.label}</span>
                        <span className="priceDetail-base-value"> {currencyFormat(order_summary.shipping_incl_tax.amount, 'INR')}</span>
                      </div> : null
                  }
                  {/* {
                    typeof totals.tax !== 'undefined'
                    &&
                    <div className="priceDetail-base-row">
                      <span className="s-title">{totals.tax.title} <a href="javascript:void(0);" data-toggle="modal" data-target="#delivery-info" className="icon-info-border"></a></span>
                      <span className="priceDetail-base-value">{currencyFormat(totals.tax.value, 'INR')}</span>
                    </div>
                  }

                  {
                    typeof totals.shipping !== 'undefined'
                    &&
                    <div className="priceDetail-base-row">
                      <span className="s-title">Delivery <a href="javascript:void(0);" data-toggle="modal" data-target="#delivery-info" className="icon-info-border"></a></span>
                      <span className="priceDetail-base-value">{currencyFormat(totals.shipping.value, 'INR')}</span>
                    </div>
                  } */}

                  {
                    walletAmount < 0
                    &&
                    <div className="priceDetail-base-row">
                      <span className="s-title">Powerlook Wallet</span>
                      <span className="priceDetail-base-value priceDetail-base-discount">- {currencyFormat(Math.abs(totals.wallet_amount.value), 'INR')}</span>
                    </div>
                  }

                  {
                    codfee > 0
                    &&
                    <div className="priceDetail-base-row">
                      <span className="s-title">COD Fee</span>
                      <span className="priceDetail-base-value">{currencyFormat(Math.abs(codfee), 'INR')}</span>
                    </div>
                  }

                  {
                    order_summary.grand_total && freeShippingMinAmount > (parseFloat(Number(order_summary.grand_total.amount)) - walletAmount)
                      ?
                      <div className="shippingTip-base-deliveryTip">
                        <div className="sprite-ship-free shippingTip-base-tipIcon"></div>
                        <div className="shippingTip-base-tipMessage">
                          <span className="shippingTip-base-tipBold">&nbsp;Free Delivery&nbsp;</span>
                          Shop for more {currencyFormat(freeShippingMinAmount - parseFloat(Number(order_summary.grand_total.amount) - walletAmount), 'INR')}
                        </div>
                      </div>
                      :
                      ''
                  }

                  <div className="apply-coupon-cart">
                    {
                      !coupanTitle ?
                        <a href="javascript:void(0);" onClick={this.openApplyCouponCodeModal.bind(this)}>
                          <i className="icon-discount-percentage"></i>
                          <span className="text">Apply Coupon</span>
                          <i className="caret-right icon-arrow-right"></i>
                        </a>
                        :
                        <a href="javascript:void(0);" onClick={this.removeCouponCodee.bind(this)}>
                          <i className="icon-discount-percentage"></i>
                          <span className="text">{coupanTitle}</span>
                          <i className="caret-right applied-coupan">&times;</i>
                        </a>
                    }
                    {
                      checkoutText && <span className='deskmobo-checkouttxt mt-2'> {checkoutText}</span>
                    }

                  </div>

                  {
                    !isMobile()
                    &&
                    <div className="priceDetail-base-total">
                      {
                        order_summary.grand_total ?
                          <>
                            <span className="s-title">{order_summary.grand_total.label}</span>
                            <span className="priceDetail-base-value">{currencyFormat(Number(walletAmount < 0 ? this.state.walletTotalAmount : order_summary.grand_total.amount) + codfee, 'INR')}</span>
                          </> : null
                      }
                    </div>
                  }

                  {
                    isMobile()
                    &&
                    (
                      customerEmail
                        ?
                        <div className="email-base-row">
                          <h4>Order confirmation email will be sent to</h4>
                          <strong>{customerEmail}</strong>
                        </div>
                        :
                        <div className="email-base-row">
                          <h4>Order confirmation email will be sent to</h4>
                          <div className="form-ui">
                            <input type="text" ref="customer_email" />
                            {
                              emailError !== null
                              &&
                              <Error text={emailError} />
                            }
                          </div>
                        </div>
                    )
                  }

                  <div className="button-base-button">
                    {order_summary.grand_total && <div className="total-mob"><span>{order_summary.grand_total.label}</span>{currencyFormat(Number(walletAmount < 0 ? this.state.walletTotalAmount : order_summary.grand_total.amount) + codfee, 'INR')}</div>}
                    {
                      (typeof this.props.hideBtn === 'undefined' || this.props.hideBtn !== true)
                      &&
                      <a href="javascript:void(0);" className={`btn-fil-primary load ${checkoutProcessing === true ? 'show' : ''}`} onClick={this.gotoNextStep.bind(this)}>Checkout</a>
                    }
                  </div>
                </div>
                :
                <div className="priceBreakUp-base-orderSummary">
                  <div className="priceDetail-base-row">
                    <Skeleton width={282} height={16} />
                  </div>
                  <div className="priceDetail-base-row">
                    <Skeleton width={282} height={16} />
                  </div>
                  <div className="priceDetail-base-row">
                    <Skeleton width={282} height={16} />
                  </div>
                  <div className="priceDetail-base-row">
                    <Skeleton width={282} height={16} />
                  </div>
                </div>
            }

          </div>
        </div>
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    cart: { ...state.Cart.cart },
    walletCalc: { ...state.Checkout.walletCalc },
    CODFee: state.Checkout.CODFee,
    checkoutStatus: state.Checkout.status,
    checkoutCompName: state.Checkout.compName,
    status: state.Cart.status,
    compName: state.Cart.compName,
    usedCoupon: state.Checkout.usedCoupon,
    authStatus: state.Auth.status,
    authCompName: state.Auth.compName,
    order_price_summary: state.Cart && state.Cart.order_summary ? state.Cart.order_summary[0] : null
  };
}

export default withRouter(connect(mapStatesToProps, { getCart, saveWalletTotalsInfo, getOrderSummary, updateUsedCouponCode })(CartSubTotalBlock));