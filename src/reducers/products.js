import {
  SAVE_CATEGORIES,
  UPDATE_WISHLIST,
  SAVE_PRODUCTS_LIST,
  _dispatch
} from '../actions/products';

const INITIAL_STATE = { categories: [], products: {} };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {

    case SAVE_CATEGORIES:
      return { ...state, categories: action.payload };

    case UPDATE_WISHLIST:
      return _dispatch({ ...state }, true, 'update_wishlist')

    case SAVE_PRODUCTS_LIST:
      const storedProps = typeof state.products[action.category] !== 'undefined' ? state.products[action.category] : {};
      return { ...state, products: { ...state.products, [action.category]: { ...storedProps, ...action.payload } } };

    default:
      return state;
  }
}