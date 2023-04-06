import axios from 'axios';
import { API_URL, API_BASE } from '../constants';
import { _dispatch } from '../utilities';
export { _dispatch };
export const SAVE_LAYOUT = 'SAVE_LAYOUT';
export const SAVE_PRODUCT_BLOCKS = 'SAVE_PRODUCT_BLOCKS';
export const SAVE_WEB_HERO_SLIDER = 'SAVE_WEB_HERO_SLIDER';
export const SAVE_MOBILE_HERO_SLIDER = 'SAVE_MOBILE_HERO_SLIDER';
export const SAVE_TOP_RATED_PRODUCTS = 'SAVE_TOP_RATED_PRODUCTS';
export const SAVE_AD_BLOCKS = 'SAVE_AD_BLOCKS';
export const TOPBAR = 'TOPBAR';

export function fetchLayout() {
  return (dispatch) => {
    return axios({
      method: 'GET',
      url: `${API_URL}/home`,
    }).then(response => {
      dispatch({
        type: SAVE_LAYOUT,
        payload: response.data[0]
      });
    });
  };

}

export function getTopBar() {
  return (dispatch) => {
    return axios({
      method: 'GET',
      url: `${API_BASE}/datamigrate/topbar.php`,
    }).then(response => {
      dispatch({
        type: TOPBAR,
        payload: response.data
      });
    });
  };
}

export function fetchSlider(sliderId) {
  return axios({
    method: 'GET',
    url: `${API_URL}/slider/${sliderId}`,
  });
}

export function fetchBanner(bannerId) {
  return axios({
    method: 'GET',
    url: `${API_URL}/banner/${bannerId}`,
  });
}

export function staticPagesList() {
  return axios({
    method: 'GET',
    url: `${API_URL}/static-pages`,
  });
}

export function loadStaticPage(slug) {
  return axios({
    method: 'GET',
    url: `${API_URL}/page/content/${slug}`,
  });
}

export function loadStores() {
  return axios({
    method: 'GET',
    url: `${API_URL}/stores`,
  });
}

export function storeProductBlocksInMemory(data, index) {
  return {
    type: SAVE_PRODUCT_BLOCKS,
    payload: data,
    index: index
  };
}

export function storeAdsBlockInMemory(data, index) {
  return {
    type: SAVE_AD_BLOCKS,
    payload: data,
    index: index
  };
}

export function storeWebHeroSliderInMemory(data) {
  return {
    type: SAVE_WEB_HERO_SLIDER,
    payload: data
  };
}

export function storeMobileHeroSliderInMemory(data) {
  return {
    type: SAVE_MOBILE_HERO_SLIDER,
    payload: data
  };
}

export function storeTopRatedProductsInMemory(data) {
  return {
    type: SAVE_TOP_RATED_PRODUCTS,
    payload: data
  };
}

export function fetchAddress(pincode) {
  // return axios({
  //   method: 'GET',
  //   baseURL: `https://api.postalpincode.in/pincode/${pincode}`,
  //   withCredentials: false,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  //     'Content-Type': 'application/json',
  //     'Referrer-Policy': "origin"
  //   }
  // })
  return fetch(`https://api.postalpincode.in/pincode/${pincode}`)
}