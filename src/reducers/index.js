import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import Products from './products';
import Cart from './cart';
import Customer from './customer';
import Auth from './auth';
import Checkout from './checkout';
import Home from './home';
import Seo from './seo';
import SideFilter from './sideFilter';

const appReducer = combineReducers({
  form: formReducer,
  Products,
  Cart,
  Customer,
  Auth,
  Checkout,
  Home,
  Seo,
  SideFilter
});

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer;