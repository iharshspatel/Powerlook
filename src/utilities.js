import { lazy } from 'react';
import moment from 'moment';
import ReactPixel from 'react-facebook-pixel';
import { store } from './store';
import { FBPIXELID } from './constants';

export const APP_VERSION = '1.0';

export function retry(fn, retriesLeft = 5, interval = 500) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }

          // Passing on "reject" is the important part
          retry(fn, interval, retriesLeft - 1).then(resolve, reject);
        }, interval);
      });
  });
}

export function load(component) {

  return lazy(() => retry(() => import(`./components/${component}`)));
}

export function fromNow(dateTime) {
  return moment.utc(dateTime).fromNow();
}

export function utcToLocal(dateTime, format = 'DD-MM-YYYY') {
  return moment.utc(dateTime).local().format(format);
}

export function clearSession(redirectTo) {
  const { dispatch } = store;
  localStorage.removeItem('user');
  localStorage.removeItem('cartId');
  // Update auth state
  dispatch({
    type: 'SAVE_AUTH',
    payload: false
  });
  // Clear customer cart
  dispatch({
    type: 'PURGE_CART'
  });
  // redirect
  if (typeof redirectTo !== 'undefined')
    window.location = redirectTo;
}

export function clearCart(redirectTo) {
  const { dispatch } = store;
  localStorage.removeItem('cartId');
  // Clear customer cart
  dispatch({
    type: 'PURGE_CART'
  });
  // Clear checkout process
  dispatch({
    type: 'CLEAR_CHECKOUT'
  });
  // redirect
  if (typeof redirectTo !== 'undefined')
    window.location = redirectTo;
}

export function verifyAndUpdateAppVersion() {
  // Display App Version
  console.log('APP VERSION', APP_VERSION);

  const version = localStorage.getItem("APP_VERSION");
  if (version === null || version != APP_VERSION) {
    localStorage.setItem("APP_VERSION", APP_VERSION);
    clearSession();
  }
}

export function isMobile(callback) {
  const mobileWidth = 1024;

  // On window resize event
  if (typeof callback !== 'undefined') {
    window.addEventListener('resize', () => {
      callback(window.outerWidth <= mobileWidth);
    });
  }

  return window.outerWidth <= mobileWidth;
}

export function loadScript(callback, scriptId, jsSrc, callbackParams = null, attrs = {}) {
  const existingScript = document.getElementById(scriptId);

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = jsSrc;
    script.id = scriptId;
    if (Object.keys(attrs).length > 0) {
      Object.keys(attrs).map(key => {
        script.setAttribute(key, attrs[key]);
      });
    }
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback(callbackParams);
    };
  }

  if (existingScript && callback) callback(callbackParams);
}

export function unLoadScript(scriptId) {
  const existingScript = document.getElementById(scriptId);

  if (existingScript) {
    window.$$(existingScript).remove();
  }
}

export function _dispatch(nextState, rerender = false, compName = null) {
  rerender = rerender
    ? new Date().getTime()
    : nextState.status;
  return {
    ...nextState,
    status: rerender,
    compName
  }
}

export function getAttribute(data, name) {
  const attrs = data.custom_attributes.filter(attr => {
    return attr.attribute_code == name;
  });

  return typeof attrs[0] !== 'undefined' ? attrs[0].value : '';
}

export function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function currencyFormat(amount, currency, showCurrencySymbol = true, decimals = 2) {
  let currencyLocale = '';
  switch (currency) {
    case 'USD':
      currencyLocale = 'en-US';
      currency = '$';
      break;
    case 'INR':
      currencyLocale = 'en-IN';
      currency = '₹';
      break;
  }

  amount = parseFloat(amount).toFixed(decimals).toLocaleString(currencyLocale);

  if (isNaN(amount))
    return '';

  return showCurrencySymbol ? `${currency}${amount}` : amount;
}

export function dateFormat(dateTime, format) {
  return moment(dateTime).format(format);
}

export function setSessionItem(itemName, itemValue) {
  console.log("ITEM ", { itemName, itemValue })
  if (typeof itemValue === "object") {
    itemValue = JSON.stringify(itemValue);
  }
  localStorage.setItem(itemName, itemValue);
}

export function getSessionItem(itemName) {
  let result = null;
  const item = localStorage.getItem(itemName);
  try {
    result = JSON.parse(item);
  } catch (e) {
    result = item;
  }

  return result;
}

export function removeSessionItem(itemName) {
  const item = localStorage.removeItem(itemName);

  return item;
}

export function isAuth() {
  const user = getSessionItem('user');

  return user && typeof user.token !== 'undefined' ? user : false;
}

export function percentDiscount(price, finalPrice) {
  return Math.round((price - finalPrice) * 100 / price);
}

export function trackFBEvent(event, data) {
  if (typeof FBPIXELID !== 'undefined' && FBPIXELID) {
    ReactPixel.init(FBPIXELID);
    ReactPixel.track(event, data);
  }
}

export function trackwebEngageEvent(event, data) {
  window.webengage.track(event, { ...data });
}