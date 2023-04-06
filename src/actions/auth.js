import axios from "axios";
import { ToastsStore } from "react-toasts";
import { API_URL, USER_LOGGED_IN } from "../constants";
import { getSessionItem, setSessionItem, _dispatch  , trackwebEngageEvent} from "../utilities";
import { getCart } from "./cart";
export { _dispatch };
export const SAVE_AUTH = "SAVE_AUTH";
export const SAVE_OTP = "SAVE_OTP"

function _auth(response, dispatch) {
  response = response.data; //JSON.parse(response.data);
  // Wrong credentials
  if (response.status !== 200 && response.status !== 'Success') {
    ToastsStore.error(response.message);
  } else {
    // Successful login
   
    const token = response.token;
    const customerId = response.id;
    const mobile =
      typeof response.mobile !== "undefined" ? response.mobile : "";
    const activeCartId = response.quote_id;
    const cartId = getSessionItem("cartId");

    if(window.webengage !== "undefined" && response.id){
      const eventData = {"Mode":"Mobile"};
      trackwebEngageEvent('User Logged In', eventData);
      
      window.webengage.user.login(response.id);
      window.webengage.user.setAttribute('we_email', response.email);
      window.webengage.user.setAttribute('we_first_name', response.name);
      window.webengage.user.setAttribute('we_phone', mobile);
    }

    setSessionItem("user", {
      token,
      name: response.name,
      mobile: mobile,
      email: response.email,
      group_id: response.group_id,
      wishlist: response.wishlist,
      mywishlist: response.mywishlist,
    });
    // If there is any cart
    if (cartId) {
      if (activeCartId == null) {
        // Assign guest-cart (if any) to the logged in customer
        assignGuestCartToCustomer(token, cartId, customerId, dispatch);
      } else {
        // If customer has already an active cart, merge guest-cart with active cart
        mergeGuestAndCustomerCarts(cartId, activeCartId, dispatch);
      }
    } else {
      setSessionItem("cartId", activeCartId);
    }
    // Save customer auth token in storage
    dispatch({
      type: SAVE_AUTH,
      payload: true,
    });
  }
}

export function login(payload) {
  return (dispatch) => {
    return axios({
      method: "POST",
      data: payload,
      url: `${API_URL}/integration/customer/token`,
    })
      .then((response) => {
        _auth(response, dispatch);
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          ToastsStore.error(error.response.data.message);
        }
      });
  };
}

export function sendOTP(payload) {
  return (dispatch) => {
    return axios({
      method: "GET",
      url: `${API_URL}/verify/signin?username=${payload}`,
    })
      .then((response) => {
        // dispatch({ type: SAVE_OTP, payload: response.data[0] })
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          ToastsStore.error(error.response.data[0].message);
        }
      })
  };
}

export function reSendOTP(payload) {
  return (dispatch) => {
    return axios({
      method: "GET",
      url: `${API_URL}/login/otp/resend?username=${payload}`,
    })
      .then((response) => {
        // dispatch({ type: SAVE_OTP, payload: response.data[0] })
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          ToastsStore.error(error.response.data[0].message);
        }
      });
  };
}

export function verifyOTP(payload) {
  return (dispatch) => {
    return axios({
      method: "POST",
      url: `${API_URL}/otp-login?username=${payload.username}&otp=${payload.otp}`,
    })
      .then((response) => {
        _auth({ data: response.data[0] }, dispatch);
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          ToastsStore.error(error.response.data[0].message);
        }
      });
  };
}

export function generateCustomerToken(payload) {
  return axios({
    method: "POST",
    url: `${API_URL}/integration/customer/token`,
  });
}

export function assignGuestCartToCustomer(token, cartId, customerId) {
  // Assign cart to the customer
  axios({
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data: { customerId, storeId: 1 },
    url: `${API_URL}/guest-carts/${cartId}`,
  })
    .then((response) => {
      // Get active/customer cart id
      axios({
        method: "POST",
        url: `${API_URL}/customers/${customerId}/carts`,
      }).then((response) => {
        setSessionItem("cartId", response.data);
      });
    })
    .catch((error) => {
      if (error && error.response && error.response.data) {
        ToastsStore.error(error.response.data.message);
      }
    });
}

export function mergeGuestAndCustomerCarts(cartId, activeCartId, dispatch) {
  setSessionItem("cartId", activeCartId);
  // Merge Guest cart and Active cart and update in storage
  axios({
    method: "GET",
    url: `${API_URL}/merge/${cartId}/${activeCartId}`,
  })
    .then((response) => {
      // Refresh the cart
      getCart()(dispatch);
    })
    .catch((error) => {
      if (error && error.response && error.response.data) {
        ToastsStore.error(error.response.data.message);
      }
    });
}

export function socialLogin(payload) {
  return (dispatch) => {
    return axios({
      method: "POST",
      data: payload,
      url: `${API_URL}/social/login`,
    }).then((response) => {
        let provider = payload.provider;
        provider = provider.charAt(0).toUpperCase() + provider.slice(1);
        const eventData = { "mode" : provider}
        trackwebEngageEvent(USER_LOGGED_IN, eventData);
      _auth(response, dispatch);
    });
  };
}
