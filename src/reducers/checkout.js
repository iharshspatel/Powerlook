import {
  CHECKOUT_UPDATE_ADDRESS,
  CHECKOUT_UPDATE_SHIPPING_METHOD,
  CHECKOUT_UPDATE_PAYMENT_METHODS,
  CHECKOUT_UPDATE_ORDER_SUMMARY_NEXT,
  CHECKOUT_SAVE_ORDER_ID,
  UPDATE_CHECKOUT_STEP,
  CLEAR_CHECKOUT,
  SAVE_WALLET_TOTALS,
  CLEAR_PAYMENT_METHODS,
  SAVE_WALLET_DETAILS,
  INITIALIZE_CHECKOUT,
  SELECT_PAYMENT_METHOD,
  USED_COUPON_CODE,
  SELECTED_PAYMENT_OPTION,
  _dispatch
} from '../actions/checkout';

const INITIAL_STATE = {progress: {shippingAddress: null, shippingMethod: null, paymentMethods: [], orderId: null}, walletCalc: {}, walletDetails: {}, CODFee: 0, disableOptions: false, nextStep: 1, status: null, usedCoupon: null, selectedPaymentOption: null}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {

    case CHECKOUT_UPDATE_ADDRESS:
      return _dispatch({ ...state, nextStep: 2, progress: {...state.progress, shippingAddress: action.payload} }, true, 'checkout');
      break;

    case CHECKOUT_UPDATE_SHIPPING_METHOD:
      return _dispatch({ ...state, nextStep: 3, progress: {...state.progress, shippingMethod: action.payload} }, true, 'checkout');
      break;

     case CHECKOUT_UPDATE_PAYMENT_METHODS:
      return _dispatch({ ...state, progress: {...state.progress, paymentMethods: action.payload} }, true, 'checkout');
      break;

     case CLEAR_PAYMENT_METHODS:
      return _dispatch({ ...state, progress: {...state.progress, paymentMethods: []} }, true, 'checkout');
      break;

     case CHECKOUT_UPDATE_ORDER_SUMMARY_NEXT:
      return _dispatch({ ...state, nextStep: 4 }, true, 'checkout');
      break;

     case CHECKOUT_SAVE_ORDER_ID:
      return _dispatch({ ...state, progress: {...state.progress, orderId: action.payload} });
      break;

     case UPDATE_CHECKOUT_STEP:
      return _dispatch({ ...state, nextStep: action.payload }, true, 'checkout');
      break;

     case CLEAR_CHECKOUT:
      return _dispatch({...state, progress: {...state.progress, shippingAddress: null, shippingMethod: null, paymentMethods: []}, nextStep: 1, status: null});
      break;

     case INITIALIZE_CHECKOUT:
      return _dispatch({...state, progress: {...state.progress, shippingAddress: null, shippingMethod: null, paymentMethods: []}, nextStep: 1, status: null}, true, 'checkout');
      break;

     case SAVE_WALLET_DETAILS:
      let disableOptions = false;
      if(typeof action.payload.left_amount_topay !== 'undefined' && action.payload.left_amount_topay == 0){
        disableOptions = true;
      }
      return _dispatch({ ...state, disableOptions, walletDetails: action.payload }, true, 'update-wallet-details');
      break;

     case SELECT_PAYMENT_METHOD:
      return _dispatch({ ...state, CODFee: parseFloat(action.payload) }, true, 'update-payment_method');
      break;
      
      case USED_COUPON_CODE:
        return _dispatch({ ...state, usedCoupon: action.payload }, true, 'update-used-coupon-code');
        break;

      case SELECTED_PAYMENT_OPTION:
        return _dispatch({ ...state, selectedPaymentOption: action.payload }, true, 'update-selected-payment-option');
        break;

     case SAVE_WALLET_TOTALS:
      let totals = {};
      action.payload.map(item => {
        totals = {...totals, [item.code]: item};
      });

      return _dispatch({ ...state, walletCalc: totals }, true, 'wallet-calc');
      break;

    default:
      return state;
  }
}