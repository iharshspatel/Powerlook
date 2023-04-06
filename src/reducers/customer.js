import {
  FETCH_ADDRESSES,
  FETCH_SHIPPING_METHODS,
  SAVE_CUSTOMER_PROFILE,
  SAVE_ORDERS_LIST,
  SAVE_CUSTOMER_WALLET_DETAILS,
  SAVE_PINCODE,
  _dispatch
} from '../actions/customer';

import {
  SAVE_WISHLIST
} from '../actions/products';

const INITIAL_STATE = {customer: {}, orders: [], wallet: {}, availability: '', shippingMethods: [], addresses: [], wishlist: [], defaultShippingId: null, status: null, pincode: ''};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {

    case FETCH_ADDRESSES:
      const data = action.payload;
      return _dispatch({ ...state, addresses: data[1], defaultShippingId: data[0] }, true, 'addresses');
      break;

    case FETCH_SHIPPING_METHODS:
      return _dispatch({ ...state, shippingMethods: action.payload.splice(0, action.payload.length-1), availability: action.payload[action.payload.length - 1] });
      break;

    case SAVE_CUSTOMER_PROFILE:
      return (() => {
        const data = action.payload;
        data.addresses = null;
        data.lastname = data.lastname === null ? '' : data.lastname;
        return _dispatch({ ...state, customer: data}, true, 'profile');
      })();

    case SAVE_WISHLIST:
      return _dispatch({ ...state, wishlist: action.payload}, true, 'wishlist');

    case SAVE_PINCODE:
      return _dispatch({ ...state, pincode: action.payload}, false);

    case SAVE_CUSTOMER_WALLET_DETAILS:
      return { ...state, wallet: action.payload};

    case SAVE_ORDERS_LIST:
      return { ...state, orders: action.payload};

    default:
      return state;
  }
}