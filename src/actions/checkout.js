import axios from 'axios';
import { API_URL, API_BASE } from '../constants';
import { _dispatch, getSessionItem } from '../utilities';
export { _dispatch };
export const CHECKOUT_UPDATE_ADDRESS = 'CHECKOUT_UPDATE_ADDRESS';
export const CHECKOUT_UPDATE_SHIPPING_METHOD = 'CHECKOUT_UPDATE_SHIPPING_METHOD';
export const CHECKOUT_UPDATE_PAYMENT_METHODS = 'CHECKOUT_UPDATE_PAYMENT_METHODS';
export const CHECKOUT_UPDATE_ORDER_SUMMARY_NEXT = 'CHECKOUT_UPDATE_ORDER_SUMMARY_NEXT';
export const CHECKOUT_SAVE_ORDER_ID = 'CHECKOUT_SAVE_ORDER_ID';
export const UPDATE_CHECKOUT_STEP = 'UPDATE_CHECKOUT_STEP';
export const CLEAR_CHECKOUT = 'CLEAR_CHECKOUT';
export const INITIALIZE_CHECKOUT = 'INITIALIZE_CHECKOUT';
export const SAVE_WALLET_TOTALS = 'SAVE_WALLET_TOTALS';
export const SAVE_WALLET_DETAILS = 'SAVE_WALLET_DETAILS';
export const CLEAR_PAYMENT_METHODS = 'CLEAR_PAYMENT_METHODS';
export const SELECT_PAYMENT_METHOD = 'SELECT_PAYMENT_METHOD';
export const SELECTED_PAYMENT_OPTION = 'SELECTED_PAYMENT_OPTION';
export const USED_COUPON_CODE = 'USED_COUPON_CODE';

export function clearCheckoutSteps(shippingAddress) {

  return (dispatch) => {
    dispatch({
      type: INITIALIZE_CHECKOUT
    });
  };
}

export function selectPaymentMethod(value) {

  return (dispatch) => {
    dispatch({
      type: SELECT_PAYMENT_METHOD,
      payload: value
    });
  };
}

export function updateUsedCouponCode(value) {

  return (dispatch) => {
    dispatch({
      type: USED_COUPON_CODE,
      payload: value
    });
  };
}

export function updateSelectedPaymentOption(value) {

  return (dispatch) => {
    dispatch({
      type: SELECTED_PAYMENT_OPTION,
      payload: value
    });
  };
}

export function updateDeliveryAddress(shippingAddress) {

  return (dispatch) => {
    dispatch({
      type: CHECKOUT_UPDATE_ADDRESS,
      payload: shippingAddress
    });
  };
}

export function updateShippingMethod(shippingMethod) {

  return (dispatch) => {
    dispatch({
      type: CHECKOUT_UPDATE_SHIPPING_METHOD,
      payload: shippingMethod
    });
  };
}

export function fetchShippingInformation(shippingAddress, shippingMethod) {
  const user = getSessionItem('user');

  const data = {
    addressInformation: {
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      shipping_carrier_code: shippingMethod.carrier_code,
      shipping_method_code: shippingMethod.method_code
    }
  };

  return (dispatch) => {
    // Save payment methods
    dispatch({
      type: CLEAR_PAYMENT_METHODS
    });
    axios({
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}` },
      data: data,
      url: `${API_URL}/carts/mine/shipping-information`,
    }).then(response => {
      // Update cart totals
      dispatch({
        type: 'SAVE_CART',
        payload: response.data.totals
      });
      // Save payment methods
      dispatch({
        type: CHECKOUT_UPDATE_PAYMENT_METHODS,
        payload: response.data.payment_methods
      });
    });
  };
}

export function fetchShippingInformationNext() {

  return (dispatch) => {
    dispatch({
      type: CHECKOUT_UPDATE_ORDER_SUMMARY_NEXT
    });
  };
}

export function saveOrderId(orderId, razorpay_payment_id) {

  return (dispatch) => {
    dispatch({
      type: CHECKOUT_SAVE_ORDER_ID,
      payload: { orderId, razorpay_payment_id }
    });
  };
}

export function fetchPaymentInfo(data) {
  const user = getSessionItem('user');

  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
    data: data,
    url: `${API_URL}/carts/mine/payment-information`,
  });
}

export function startPayment(orderId) {
  const user = getSessionItem('user');

  return axios({
    method: 'GET',
    url: `${API_URL}/payumoney/payment/start/${orderId}`,
  });
}

export function callbackPayUMoney(data) {
  return axios({
    method: 'POST',
    data: data,
    url: `${API_URL}/payumoney/ipn/callback`,
  });
}

export function updateCheckoutToStep(step) {

  return (dispatch) => {
    dispatch({
      type: UPDATE_CHECKOUT_STEP,
      payload: step
    });
  };
}

export function createRazorPayOrder(orderId) {
  const user = getSessionItem('user');
  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
    data: { orderId },
    url: `${API_URL}/razorpaypg/payment/order`,
  });
}

export function updateCustomerEmail(email) {
  const user = getSessionItem('user');
  const cartId = getSessionItem('cartId');
  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
    data: { email, quote: cartId },
    url: `${API_URL}/update/email`,
  });
}

export function applyWalletBalance(data) {
  const user = getSessionItem('user');
  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
    data: data,
    url: `${API_URL}/wallet/apply`,
  });
}

export function saveWalletTotalsInfo(data) {
  return (dispatch) => {
    dispatch({
      type: SAVE_WALLET_TOTALS,
      payload: data[1]
    });
    dispatch({
      type: SAVE_WALLET_DETAILS,
      payload: data[0]
    });
  };
}

export function getOrderInfoById(orderId) {
  return axios({
    method: 'GET',
    params: { orderId },
    url: `${API_BASE}/datamigrate/orderData.php`,
  });
}

export function getOrderInfoByQuoteId(quoteId, orderedMethod, IsReferrerUrl) {
  if (orderedMethod == 'razorpay') {
    return axios({
      method: 'GET',
      params: { quoteId },
      url: `${API_BASE}/datamigrate/quoteDataNew.php`,
    });
  } else {
    return axios({
      method: 'GET',
      params: { ...quoteId, IsReferrerUrl },
      url: `${API_BASE}/datamigrate/orderDataNew.php`,
    });
  }
}

export function createRazorPayOrderByQoute() {
  const user = getSessionItem('user');
  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
    url: `${API_BASE}/datamigrate/createRazorPayOrder.php`,
  });
}