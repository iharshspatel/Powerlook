import {
  SAVE_CART,
  SAVE_CART_TOTAL,
  SAVE_REGIONS,
  DELETE_ITEM_FROM_CART,
  PURGE_CART,
  PROCESSING_CART,
  _dispatch,
  SAVE_ORDER_DETAIL_SUMMARY
} from '../actions/cart';

import {
  UPDATE_WISHLIST_STATUS
} from '../actions/products';

const INITIAL_STATE = { cart: {}, regions: [], status: null }

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {

    case SAVE_CART:
      let totalDiscount = 0;
      let totals = {};
      const cart = action.payload;
      cart.total_segments.map(item => {
        totals = { ...totals, [item.code]: item };
      });

      if (!cart.items.length) {
        return _dispatch({ ...state, cart: {} }, true, 'empty-cart');
      } else {
        return _dispatch({ ...state, cart: { ...cart, total_segments: totals } }, true, 'cart');
      }

      break;

    // case SAVE_CART_TOTAL:
    //   let totals = {};
    //  action.payload.map(item => {
    //    totals = {...totals, [item.code]: item}
    //  });
    //   return _dispatch({ ...state, totals}, true, 'cart_totals');
    //   break;

    case SAVE_ORDER_DETAIL_SUMMARY:
      return _dispatch({ ...state, order_summary: action.payload }, true, 'order_summary_detail')

    case DELETE_ITEM_FROM_CART:
      const cartItems = [...state.cart.items].filter(item => {
        return item.item_id != action.payload
      });

      return _dispatch({ ...state, cart: { ...state.cart, items: cartItems } }, true, 'cart');
      break;

    case SAVE_REGIONS:
      return _dispatch({ ...state, regions: action.payload }, true, 'regions');
      break;

    case PURGE_CART:
      return _dispatch({ ...state, cart: {} }, true, 'empty-cart');
      break;

    case PROCESSING_CART:
      return _dispatch({ ...state }, true, 'processing-cart');
      break;

    case UPDATE_WISHLIST_STATUS:
      if (typeof state.cart.items === 'undefined') {
        return state;
      }
      let items = [...state.cart.items];
      const productId = action.productId;
      const status = action.payload;
      items = items.map(item => {
        if (productId == item.extension_attributes.id) {
          return { ...item, extension_attributes: { ...item.extension_attributes, wish_list: status } };
        }
        return item;
      });
      return _dispatch({ ...state, cart: { ...state.cart, items } }, true, 'cart');
      break;

    default:
      return state;
  }
}