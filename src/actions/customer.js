import axios from 'axios';
import { API_URL, API_BASE, DELETE_ADDRESS , ADD_NEW_ADDRESS , EDIT_ADDRESS} from '../constants';
import { getSessionItem, trackwebEngageEvent, _dispatch } from '../utilities';
export { _dispatch };
export const FETCH_ADDRESSES = 'FETCH_ADDRESSES';
export const SAVE_CUSTOMER_PROFILE = 'SAVE_CUSTOMER_PROFILE';
export const FETCH_SHIPPING_METHODS = 'FETCH_SHIPPING_METHODS';
export const UPDATE_AUTH = 'UPDATE_AUTH';
export const SAVE_ORDERS_LIST = 'SAVE_ORDERS_LIST';
export const SAVE_CUSTOMER_WALLET_DETAILS = 'SAVE_CUSTOMER_WALLET_DETAILS';
export const SAVE_PINCODE = 'SAVE_PINCODE';

export function fetchCustomerAddresses() {
  const user = getSessionItem('user');

  return (dispatch) => {
    axios({
      method: 'GET',
      headers: { Authorization: `Bearer ${user.token}` },
      url: `${API_URL}/customers/mine/addresses`,
    }).then(response => {
      dispatch({
        type: FETCH_ADDRESSES,
        payload: response.data
      });
    });
  };
}

export function fetchShippingMethods(address) {
  const user = getSessionItem('user');

  return (dispatch) => {
    return axios({
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}` },
      data: { address },
      url: `${API_URL}/carts/mine/estimate-shipping-methods`
    }).then(response => {
      dispatch({
        type: FETCH_SHIPPING_METHODS,
        payload: response.data
      });
    });
  };
}

export function fetchShippingMethodsMobile(address) {
  const user = getSessionItem('user');

  return (dispatch) => {
    return axios({
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}` },
      data: { address },
      url: `${API_URL}/carts/mine/estimate-shipping-methods`
    }).then(response => {
      dispatch({
        type: FETCH_SHIPPING_METHODS,
        payload: response.data
      });

      // dispatch({
      //   type: 'CHECKOUT_UPDATE_ADDRESS',
      //   payload: address
      // });

      // dispatch({
      //   type: 'CHECKOUT_UPDATE_SHIPPING_METHOD',
      //   payload: response.data[0]
      // });
    });
  };
}

export function saveShippingAddress(values, callback) {
  const user = getSessionItem('user');
  const address_data = {"Full Name" : values["name"] || '', "Instructions" : values.instructions || '' , 
  "Address 1" :values.street[0] || '' , "Address 2" : values.street[1] || '', "City" : values.city || '', "Pin Code": values.postcode || '', "Country":'India' , "State" : values.region || '', "Mobile Number" : "+91"+values.telephone || '', "Landmark" : values.street[2] || '', "Address Type" : values["address_type"]  ||  '', "Default Address" :  `${values["is_default"]}`  || '',
}
if(values.entity_id){
  trackwebEngageEvent(EDIT_ADDRESS , address_data)
}
else{
  trackwebEngageEvent(ADD_NEW_ADDRESS , address_data)
}


  return (dispatch) => {
    return axios({
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}` },
      data: values,
      url: `${API_URL}/customers/mine/addresses/save`,
    }).then(response => {
      if (typeof callback !== 'undefined') {
        callback({ ...values, entity_id: response.data });
      }
      fetchCustomerAddresses()(dispatch);
    });
  };
}

export function deleteShippingAddress(addressId) {
  const user = getSessionItem('user');
trackwebEngageEvent(DELETE_ADDRESS , {"clicked" : `${addressId}`});
  return (dispatch) => {
    return axios({
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` },
      url: `${API_URL}/customers/address/delete/${addressId}`,
    }).then(response => {
      fetchCustomerAddresses()(dispatch);
    });
  };
}

export function fetchShippingAddressById(addressId) {
  const user = getSessionItem('user');

  return axios({
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token}` },
    url: `${API_BASE}/datamigrate/addressById.php?id=${addressId}`,
  });
}

export function viewProfile() {
  const user = getSessionItem('user');

  return (dispatch) => {
    return axios({
      method: 'GET',
      headers: { Authorization: `Bearer ${user.token}` },
      url: `${API_URL}/customers/me`,
    }).then(response => {
      dispatch({
        type: SAVE_CUSTOMER_PROFILE,
        payload: response.data
      });

      dispatch({
        type: UPDATE_AUTH
      });
    });
  };
}

export function saveProfileData(data) {
  const user = getSessionItem('user');

  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
    data: data,
    url: `${API_URL}/profile/edit`,
  });
}

export function fetchOrdersList(params) {
  const user = getSessionItem('user');

  return axios({
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token}` },
    params,
    url: `${API_URL}/customers/mine/orders`,
  });
}

export function fetchOrderDetail(orderId) {
  const user = getSessionItem('user');

  return axios({
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token}` },
    url: `${API_URL}/customers/mine/orders/${orderId}`,
  });
}

export function downloadInvoice(orderId) {
  const user = getSessionItem('user');

  return axios({
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token}` },
    url: `${API_URL}/download/invoice/${orderId}`,
    responseType: 'blob'
  }).then(response => {
    const FileDownload = require('js-file-download');
    FileDownload(response.data, 'invoice.pdf', 'application/pdf');
  });
}

export function updatePassword(values) {
  const user = getSessionItem('user');

  return axios({
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token}` },
    data: values,
    verifyAuth: false,
    url: `${API_URL}/customers/me/password`,
  });
}

export function cancelTheOrder(orderId, data) {
  const user = getSessionItem('user');
  return axios({
    method: 'GET',
    url: `${API_URL}/cancel/order/${orderId}`,
    headers: { Authorization: `Bearer ${user.token}` },
    params: data,
  });

}
export function resendSignUpOTP(data) {
  return axios({
    method: 'POST',
    data: data,
    url: `${API_URL}/signup/otp/resend`,
  });
}

export function signupUser(data) {
  return axios({
    method: 'POST',
    data: data,
    url: `${API_URL}/signup`,
  });
}

export function verifyOTPAndSignup(data) {
  return axios({
    method: 'POST',
    data: data,
    url: `${API_URL}/signup/otp/verify`,
  });
}

export function verifyUsernameExists(data) {
  return axios({
    method: 'GET',
    params: { username: data },
    url: `${API_URL}/verify/username`,
  });
}

export function verifyOTPAndResetPassword(data) {
  return axios({
    method: 'POST',
    data: data,
    url: `${API_URL}/resetpassword`,
  });
}

export function editProfile(data) {
  return axios({
    method: 'POST',
    data: data,
    url: `${API_URL}/profile/edit`,
  });
}

export function saveOrdersListToMemory(data) {
  return {
    type: SAVE_ORDERS_LIST,
    payload: data
  }
}

export function fetchWalletInfo() {
  const user = getSessionItem('user');
  return axios({
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token}` },
    url: `${API_URL}/wallet`,
  });
}

export function saveWalletInfoToMemory(data) {
  return {
    type: SAVE_CUSTOMER_WALLET_DETAILS,
    payload: data
  }
}

export function createRazorPayAddMoneyOrder(amount) {
  const user = getSessionItem('user');
  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
    data: { amount },
    url: `${API_URL}/wallet/createTransaction`,
  });
}

export function addMoneyToCustomerWallet(data) {
  const user = getSessionItem('user');
  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
    data: data,
    url: `${API_URL}/wallet/addmoney`,
  });
}

export function newletterSignup(email) {
  const user = getSessionItem('user');
  let config = {
    method: 'POST',
    data: { email },
    url: `${API_URL}/newsletter/subscribe`,
  };
  if (user) {
    config.headers = { Authorization: `Bearer ${user.token}` };
  }
  return axios(config);
}

export function addPincodeToMemory(pincode) {
  return {
    type: SAVE_PINCODE,
    payload: pincode
  }
}