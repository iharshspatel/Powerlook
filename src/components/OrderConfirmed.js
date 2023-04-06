import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import HeaderCheckout from './HeaderCheckout';
import Footer from './Footer';
import { isAuth, trackFBEvent, percentDiscount, trackwebEngageEvent } from '../utilities';
import { getOrderInfoByQuoteId } from '../actions/checkout';
import { CHECKOUT_COMPLETED } from '../constants';

class OrderConfirmed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      orderId: '',
      orderedMethod: '',
      response: '',
      loading: true
    };

    this.updateInfo = this.updateInfo.bind(this);
    this.getOrderInfo = this.getOrderInfo.bind(this);
  }

  componentWillMount() {
    const user = isAuth();
    if (!user || this.props.orderId === null) {
      this.props.history.push('/');
    } else {
      this.setState({
        username: user.name
      });

      this.getOrderInfo(this.props.orderId, this.props.orderedMethod);
    }
  }

  getOrderInfo(orderId, orderedMethod) {
    let req = {
      orderId: orderId.orderId,
      payment_id: orderId.razorpay_payment_id
    }
    console.log("getOrderInfo >>> ", req, orderedMethod);

    var referrerUrl = localStorage.getItem("websiteReferrer");
    getOrderInfoByQuoteId(req, orderedMethod, referrerUrl).then((response) => {
      if (response.data.orderId == '' || response.data.orderId === null) {
        setTimeout(() => this.getOrderInfo(orderId, orderedMethod), 100);
      } else {
        this.updateInfo(response, orderedMethod);
      }
    });
  }

  updateInfo(response, orderedMethod) {
    trackFBEvent('Purchase',
      { content_type: 'product', currency: 'INR', value: response.data.total, content_ids: response.data.content_ids, contents: response.data.contents });
    this.setState({
      orderId: response.data.orderId,
      loading: false
    });

    // Google data layer script
    const orderInfo = response.data;
    let dataLayerObject = {};
    let newdataLayerObject = {};
    const products = [];
    const productDetail = [];
    const productItems = [];  
    
    orderInfo.googleScriptProducts.map(product => {
      products.push(
        {          // List of productFieldObjects.
          'name': product.name,  // Name or ID is required.
          'id': product.id,
          'price': Number(product.price),
          'quantity': product.quantity
        }
      );
      productDetail.push(
        {          // List of productFieldObjects.
          'Product Name': product.name,  // Name or ID is required.
          'Product Id': product.id,
          'Price': Number(product.price),
          'Quantity': product.quantity,
          "Category Id": product.category_id ? product.category_id : "",
          "Category Name": product.category_name ? product.category_name : "",
        }
      );

    });
    // dataLayerObject = {
    //   'event': 'gtm4wp.orderCompletedEEC',
    //   'ecommerce': {
    //     'purchase': {
    //       'actionField': {
    //         'id': orderInfo.orderId,        // Transaction ID. Required           
    //         'revenue': orderInfo.total,   // Total transaction value (incl. tax and shipping)
    //         'subTotal': "" + response.data.subTotal,
    //         'tax': orderInfo.tax,
    //         'shipping': orderInfo.shipping,
    //         'coupon': orderInfo.coupon ? orderInfo.coupon : '',
    //       },
    //       'products': products //expand this array if more product exists
    //     }
    //   }
    // };

    // window.dataLayer.push(dataLayerObject);

    dataLayerObject = {
      'event': 'admitad_transaction',
      'order_id': orderInfo.orderId,         
      'order_value': "" + response.data.subTotal,
      'currency': "INR"
    };
    
    window.dataLayer.push(dataLayerObject);

    console.log("admitad_transaction >>> ", dataLayerObject);

    if (orderInfo && orderInfo.googleScriptProducts) {      
      orderInfo.googleScriptProducts.map(product => {
        productItems.push({
          'item_id': product.id,
          'item_name': product.name,
          'coupon': orderInfo.coupon ? orderInfo.coupon : '',
          'discount': percentDiscount(
            product.price,
            product.finalprice
          ),
          'item_category': product.category_name ? product.category_name : "",
          'price': product.finalprice,
          'quantity': product.quantity
        });
      });
    }

    if (window.gtag) {
      // window.gtag('event', 'conversion', {
      //   'send_to': 'AW-767793026/oar1CLqJoZUBEIKvju4C',
      //   'transaction_id': ''
      // });

      window.gtag('event', 'conversion', {
        'send_to': 'AW-767793026/oar1CLqJoZUBEIKvju4C',
        'value': orderInfo.total,
        'currency': "INR",
        'transaction_id': orderInfo.orderId
      });


      newdataLayerObject = {
          'send_to': 'AW-767793026/oar1CLqJoZUBEIKvju4C',
          'value': orderInfo.total,
          'currency': "INR",
          'transaction_id': orderInfo.orderId
      };

      console.log("event_conversion >>> ", newdataLayerObject);


      window.gtag("event", "purchase", {
        'transaction_id': orderInfo.orderId,
        'value': orderInfo.total,
        'tax': orderInfo.tax,
        'shipping': orderInfo.shipping,
        'currency': "INR",
        'coupon': orderInfo.coupon ? orderInfo.coupon : '',
        'items': productItems
      });
    }

    // webEngage event
    trackwebEngageEvent(CHECKOUT_COMPLETED, {
      "Order Id": orderInfo.orderId,
      "Product Name": productDetail ? productDetail.map(item => item["Product Name"]).join(",") : "",
      "Product Id": productDetail ? productDetail.map(item => item["Product Id"]).join(",") : "",
      "Category Id": productDetail ? productDetail.map(item => item["Category Id"]).join(",") : "",
      "Category Name": productDetail ? productDetail.map(item => item["Category Name"]).join(",") : "",
      "Payment Mode": orderInfo.order_payment_method ? orderInfo.order_payment_method : 'COD',
      "currency": "INR",
      "No. Of Products": productDetail.length,
      "Total Amount": parseFloat(orderInfo.total),
      "Product Details": productDetail,
      "Discount Amount": orderInfo.discountAmount ? `${Math.abs(parseFloat(orderInfo.discountAmount))}` : "0",
      "Coupon Code": orderInfo.coupon ? orderInfo.coupon : '',
      "Shipping Charges": orderInfo.shipping ? parseFloat(orderInfo.shipping) : 0,
      "Tax Charged": orderInfo.tax ? parseFloat(orderInfo.tax) : 0,
      "Shipping Details": JSON.stringify(orderInfo.shippingaddress)
    })
  }

  render() {
    const { username, orderId, loading } = this.state;

    return (
      <div className="main-wrapper">
        <HeaderCheckout />
        <div className="cart-block-container">
          <div className="container sm-container">
            <div className="completeOrderContainer">
              <span className="icon-border-check"></span>
              <div className="order-name">Hey {username.toUpperCase()},</div>
              <h1>Your Order is Confirmed!</h1>
              <p>We’ll send you a shipping confirmation email as soon as your order ships.</p>
              {loading === false ? <div className="order-id">Order ID: #{orderId}</div> : <div className="order-id">Fetching Order ID ...</div>}
              <Link to="/" className="btn-fil-primary">Continue Shopping</Link>
            </div>
          </div>
        </div>
        <Footer />
        {/* seoContent={meta_data} */}
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    orderId: state.Checkout.progress.orderId,
    orderedMethod: state.Checkout.progress.orderedMethod,
    razorpay_payment_id: state.Checkout.progress.razorpay_payment_id
  }
}

export default connect(mapStatesToProps)(OrderConfirmed);
