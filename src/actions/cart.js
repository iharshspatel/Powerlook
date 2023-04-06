import axios from 'axios';
import { store } from '../store';
import { ADD_TO_BAG, API_URL, CART_UPDATED, MEDIA_BASE } from '../constants';
import { getSessionItem, setSessionItem, trackwebEngageEvent, _dispatch } from '../utilities';
export { _dispatch };
export const SAVE_CART = 'SAVE_CART';
export const SAVE_CART_TOTAL = 'SAVE_CART_TOTAL';
export const SAVE_REGIONS = 'SAVE_REGIONS';
export const DELETE_ITEM_FROM_CART = 'DELETE_ITEM_FROM_CART';
export const PURGE_CART = 'PURGE_CART';
export const PROCESSING_CART = 'PROCESSING_CART';
export const SAVE_ORDER_DETAIL_SUMMARY = "SAVE_ORDER_DETAIL_SUMMARY";
const CancelToken = axios.CancelToken;

let cancelRequest = null;

export function addToCart(payload, cart) {
  if (payload.productDetail) {
    trackwebEngageEvent(ADD_TO_BAG, payload.productDetail);
  }
  return new Promise((resolve, reject) => {
    // Get customer token
    const user = getSessionItem('user');
    if (user && typeof user.token !== 'undefined') {
      addToCustomerCart(user.token, payload, cart, resolve, reject);
    } else {
      addToGuestCart(payload, cart, resolve, reject);
    }
  });
}

export function addToCustomerCart(token, payload, cart, resolve, reject) {
  // Check if cart already created
  let cartId = getSessionItem('cartId');
  // if not
  if (cartId === null || typeof cartId === 'undefined' || typeof cart.items === 'undefined') {
    // create an empty cart
    createCustomerCart(token).then(response => {
      cartId = response.data;
      // Add a new item in to the cart
      addItemToCustomerCart(cartId, token, payload).then(response => {
        resolve(response);
      }).catch(response => {
        reject(response);
      });
      setSessionItem('cartId', cartId);
    });
  } else {
    // Add a new item in to the cart
    addItemToCustomerCart(cartId, token, payload).then(response => {
      resolve(response);
    }).catch(response => {
      reject(response);
    });
  }
}

export function addToGuestCart(payload, cart, resolve, reject) {
  // Check if cart already created
  let cartId = getSessionItem('cartId');
  // if not
  if (cartId === null || typeof cartId === 'undefined' || typeof cart.items === 'undefined') {
    // create an empty cart
    createGuestCart().then(response => {
      cartId = response.data;
      // Add a new item in to the cart
      addItemToGuestCart(cartId, payload).then(response => {
        resolve(response);
      }).catch(response => {
        reject(response);
      });
      setSessionItem('cartId', cartId);
    });
  } else {
    // Add a new item in to the cart
    addItemToGuestCart(cartId, payload).then(response => {
      resolve(response);
    }).catch(response => {
      reject(response);
    });
  }
}

export function createGuestCart() {
  return axios({
    method: 'POST',
    url: `${API_URL}/guest-carts`
  });
}

export function createCustomerCart(token) {
  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    url: `${API_URL}/carts/mine`
  });
}

export function addItemToGuestCart(cartId, payload) {
  payload.cartItem.quote_id = cartId;
  return axios({
    method: 'POST',
    data: payload,
    url: `${API_URL}/guest-carts/${cartId}/items`
  });
}

export function addItemToCustomerCart(cartId, token, payload) {
  payload.cartItem.quote_id = cartId;
  payload.cartId = cartId;
  //payload.address = {customer_id: 3};
  return axios({
    method: 'POST',
    data: payload,
    headers: { Authorization: `Bearer ${token}` },
    url: `${API_URL}/carts/mine/items`
  });
}

export function updateCart(payload, itemId) {
  // Get customer token
  const user = getSessionItem('user');
  const { dispatch } = store;
  // Set cart to processing
  dispatch({
    type: PROCESSING_CART
  });

  if (user && typeof user.token !== 'undefined') {
    return updateCustomerCart(user.token, payload, itemId);
  } else {
    return updateGuestCart(payload, itemId);
  }
}

export function updateGuestCart(payload, itemId) {
  // Check if cart already created
  const cartId = getSessionItem('cartId');
  payload.cartItem.quote_id = cartId;
  return axios({
    method: 'PUT',
    data: payload,
    url: `${API_URL}/guest-carts/${cartId}/items/${itemId}`
  });
}

export function updateCustomerCart(token, payload, itemId) {
  // Check if cart already created
  const cartId = getSessionItem('cartId');
  payload.cartItem.quote_id = cartId;
  return axios({
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    data: payload,
    url: `${API_URL}/carts/mine/items/${itemId}`
  });
}

export function recalcCartTotal() {
  const user = getSessionItem('user');
  const cartId = getSessionItem('cartId');
  const config = {
    method: 'GET'
  };

  // For customer cart
  if (user && typeof user.token !== 'undefined') {
    config.url = `${API_URL}/carts/mine/totals`;
    config.headers = { Authorization: `Bearer ${user.token}` };
    config.hideError = 404;
  } else {
    // For guest cart
    if (cartId) {
      config.url = `${API_URL}/guest-carts/${cartId}/totals`;
    }
  }

  return axios(config);
}

export function getCart(eventType = '') {
  if (cancelRequest) {
    cancelRequest();
  }
  const user = getSessionItem('user');
  const cartId = getSessionItem('cartId');
  const config = {
    method: 'GET',
    cancelToken: new CancelToken(function executor(c) {
      cancelRequest = c;
    })
  };

  if (!cartId) {
    return dispatch => dispatch({
      type: PURGE_CART
    });
  }

  // For customer cart
  if (user && typeof user.token !== 'undefined') {
    config.url = `${API_URL}/carts/mine/totals`;
    config.headers = { Authorization: `Bearer ${user.token}` };
    config.hideError = 404;
  } else {
    // For guest cart
    if (cartId) {
      config.url = `${API_URL}/guest-carts/${cartId}/totals`;
    }
  }

  return (dispatch) => {
    // Set cart to processing
    dispatch({
      type: PROCESSING_CART
    });
    return axios(config)
      .then((response) => {
        dispatch({
          type: SAVE_CART,
          payload: response.data
        })

        // web engage event after cart is updated 
        if (eventType === "cart_updated") {
          try {
            const cartData = response.data;
            const product_details = [];
            cartData.items.map((product) => {
              const ob = {};
              ob["Product ID"] = `${product.extension_attributes.skuu}`;
              ob["Product Name"] = product.name;
              ob["Category Name"] = product.extension_attributes.category;
              ob["Category Id"] = product.extension_attributes.id;
              ob["Quantity"] = product.qty;
              ob["Retail Price"] = product.price;
              ob["Discount"] = Number(product.discount_amount);
              ob["Price"] = Number(product.base_price_incl_tax);
              ob["Size"] = product.extension_attributes.skuu
                ? product.extension_attributes.skuu
                : "";
              ob["Image"] = [product.extension_attributes.image ? `${MEDIA_BASE}/catalog/product/${product.extension_attributes.image}` : ''];
              ob["Currency"] = "INR";
              product_details.push(ob);
            });

            const webEngageObj = {
              "No. Of Products": cartData.items.length,
              "Total Amount": Number(cartData.base_grand_total),
              "Product Details": product_details,
            };
            trackwebEngageEvent(CART_UPDATED, webEngageObj);
          } catch (error) {
            console.log(error);
          }
        }
      }).catch(error => {
        if (error.response && error.response.status === 404) {
          dispatch({
            type: PURGE_CART
          });
        }
      });
  };
}

export const getOrderSummary = () => {
  const user = getSessionItem('user');
  const cartId = getSessionItem('cartId');
  if (cartId) {
    const config = {
      method: 'GET',
      url: `${API_URL}/carts/mine/pricedetails?quote_id=${cartId}`,
      hideError: 404
    };

    // For customer cart
    if (user && typeof user.token !== 'undefined') {
      config.headers = { Authorization: `Bearer ${user.token}` };
    } else {
      config.url = `${API_URL}/guest-carts/mine/pricedetails?quote_id=${cartId}`
    }

    return (dispatch) => {
      return axios(config)
        .then((response) => {
          dispatch({
            type: SAVE_ORDER_DETAIL_SUMMARY,
            payload: response.data
          })
        }).catch(error => {

        });
    };
  }
}

export function getRegionsList() {
  return (dispatch) => {
    const request = axios({
      method: 'GET',
      url: `${API_URL}/regions/IN`
    }).then((response) => dispatch({
      type: SAVE_REGIONS,
      payload: response.data
    }));
  };
}

export function deleteItemFromCart(itemId) {
  const { dispatch } = store;
  const user = getSessionItem('user');
  const cartId = getSessionItem('cartId');
  const config = {
    method: 'DELETE'
  };

  // Set cart to processing
  dispatch({
    type: PROCESSING_CART
  });

  // For customer cart
  if (user && typeof user.token !== 'undefined') {
    config.url = `${API_URL}/carts/mine/items/${itemId}`;
    config.headers = { Authorization: `Bearer ${user.token}` };
  } else {
    // For guest cart
    config.url = `${API_URL}/guest-carts/${cartId}/items/${itemId}`;
  }
  return axios(config);
}

export function applyCouponCode(couponCode) {
  const cartId = getSessionItem('cartId');
  const user = getSessionItem('user');
  const config = {
    method: 'POST',
    url: `${API_URL}/apply-coupon-code/${cartId}`,
    data: { coupon_code: couponCode },
  };

  // For customer cart
  if (user && typeof user.token !== 'undefined') {
    config.headers = { Authorization: `Bearer ${user.token}` };
  }

  return axios(config);
}

export function removeCouponCode() {
  const cartId = getSessionItem('cartId');
  const user = getSessionItem('user');
  const config = {
    method: 'POST',
    url: `${API_URL}/remove-coupon-code/${cartId}`
  };

  // For customer cart
  if (user && typeof user.token !== 'undefined') {
    config.headers = { Authorization: `Bearer ${user.token}` };
  }

  return axios(config);
}

export function getCouponsList() {
  const cartId = getSessionItem('cartId');
  const user = getSessionItem('user');
  const config = {
    method: 'GET',
    url: `${API_URL}/coupons`,
    params: { cartId }
  };

  // For customer cart
  if (user && typeof user.token !== 'undefined') {
    config.headers = { Authorization: `Bearer ${user.token}` };
  }

  return axios(config);
}

export function getCheckoutText() {
  const config = {
    method: 'GET',
    url: `${API_URL}/customer/mine/checkout-page-text`
  };
  return axios(config);
}

export function verifyCartItemInStock() {
  const cartId = getSessionItem('cartId');
  const config = {
    method: 'GET',
    url: `${API_URL}/verify/cart/items/${cartId}`,
  };

  return axios(config);
}