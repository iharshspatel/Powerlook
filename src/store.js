import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import MemoryStorage from 'redux-persist-memory-storage';
import promise from "redux-promise-middleware";
import logger from "redux-logger";
import ReduxThunk from 'redux-thunk';
import axios from 'axios';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers/index'; // the value from combineReducers
import {clearSession, clearCart} from './utilities';
import {ROUTES} from './routes';
import {ROOT, MAGEAPI_INTEGRATION_KEY} from './constants';
import {ToastsStore} from 'react-toasts';

//const middleware = applyMiddleware(ReduxThunk, logger);
const middleware = applyMiddleware(ReduxThunk);

const persistConfig = {
  key: 'root',
  storage: new MemoryStorage()
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, compose(middleware));
export const persistor = persistStore(store);

// Send access token in every request
axios.interceptors.request.use(function (config) {
	// Magento API Access Token
	const accessToken = MAGEAPI_INTEGRATION_KEY;
	// Explicit token
	if(typeof config.headers.Authorization === 'undefined'){
		if(accessToken !== null && typeof config.token === 'undefined'){
			config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` };
		}
	}

	return config;
}, function (error) {
	return Promise.reject(error);
});


// Add a response interceptor to check user session
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
	// If session is unauthorised, then logout the user.
  if(
  	typeof error.response !== 'undefined' 
  	&& typeof error.response.status !== 'undefined'){
    if(error.response.status === 401){
      // Redirect to login page
      if(typeof error.response.config.verifyAuth === 'undefined' || error.response.config.verifyAuth === true){
        ToastsStore.error('Your are logged out.');
        clearSession(`${ROOT}${ROUTES.LOGIN.path}?redirectTo=${window.location.pathname}`);
        
        return Promise.reject(error);
      }
    }else{
      if(error.response.status === 404){
        // Redirect to login page
        if(typeof error.response.data.parameters !== 'undefined' 
          && typeof error.response.data.parameters.fieldName !== 'undefined'
          && error.response.data.parameters.fieldName == 'cartId'){
          clearCart();
          
          return Promise.reject(error);
        }
      }
    }
  	
  }else{
    // if(
    //   typeof error.response !== 'undefined' 
    //   && typeof error.response.status !== 'undefined' 
    //   && error.response.status === 404){
    //   // Redirect to home page
    //   window.location = '/';
    // }
  }

  if(typeof error.response !== 'undefined'){
    if(typeof error.response.config.hideError === 'undefined' || error.response.config.hideError != error.response.status){
        let msg = typeof error.response.data.message !== 'undefined' ? error.response.data.message : error.response.data;
        const parameters = typeof error.response.data.parameters !== 'undefined' ? error.response.data.parameters : [];
        
        if(typeof msg == 'string'){
          if(msg.match(/active cart/i)){
            clearCart();
          }else{
            if(parameters.length > 0){
              parameters.map((p, i) => {
                msg = msg.replace('%' + (i + 1), p);
              })
            }
            ToastsStore.error(msg);
          }
        }
    }
  }
  // Do something with response error
  return Promise.reject(error);
});