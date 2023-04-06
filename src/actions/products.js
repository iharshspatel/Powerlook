import axios from 'axios';
import { API_URL, API_BASE, WISHLIST_UPDATED, ADD_TO_WISHLIST, MEDIA_BASE } from '../constants';
import {
  getSessionItem, setSessionItem, _dispatch, percentDiscount,
  trackwebEngageEvent,
} from '../utilities';
export { _dispatch };
export const SAVE_CATEGORIES = 'SAVE_CATEGORIES';
export const UPDATE_WISHLIST_STATUS = 'UPDATE_WISHLIST_STATUS';
export const UPDATE_WISHLIST = 'UPDATE_WISHLIST';
export const SAVE_WISHLIST = 'SAVE_WISHLIST';
export const SAVE_PRODUCTS_LIST = 'SAVE_PRODUCTS_LIST';
export const SIDE_FILTER = "SIDE_FILTER";

const CancelToken = axios.CancelToken;
let cancelProductSearchRequest = null;

export function fetchCategoryIdBySlug(slug) {
  return axios({
    method: 'GET',
    url: `${API_URL}/cat/${slug}`
  });
}

export function fetchFlashSaleProducts(saleId) {
  const user = getSessionItem('user');
  let headers = {};
  if (user && typeof user.token !== 'undefined') {
    headers = { Authorization: `Bearer ${user.token}` }
  }
  return axios({
    method: 'GET',
    headers: headers,
    url: `${API_URL}/flash-sale/${saleId}`
  });
}

export function fetchProductsByCategoryId(category, currentPage, limit, filters = {}) {
  const user = getSessionItem('user');
  let headers = {};
  if (user && typeof user.token !== 'undefined') {
    headers = { Authorization: `Bearer ${user.token}` }
  }
  return axios({
    method: 'GET',
    params: filters,
    headers: headers,
    url: `${API_URL}/category-products/${category}/${currentPage}/${limit}`
  });
}

export function catalogSearch(currentPage, limit, filters = {}) {
  const user = getSessionItem('user');
  let headers = {};
  if (user && typeof user.token !== 'undefined') {
    headers = { Authorization: `Bearer ${user.token}` }
  }
  return axios({
    method: 'GET',
    params: { ...filters, currentPage, limit },
    headers: headers,
    url: `${API_URL}/catalog-search`
  });
}

export function flashSaleProducts(id, currentPage, limit, filters = {}) {
  const user = getSessionItem('user');
  let headers = {};
  if (user && typeof user.token !== 'undefined') {
    headers = { Authorization: `Bearer ${user.token}` }
  }
  return axios({
    method: 'GET',
    params: { ...filters, id, currentPage, limit },
    headers: headers,
    url: `${API_BASE}/datamigrate/flashSalePage.php`
  });
}

export function fetchCategoriesList() {
  return axios({
    method: 'GET',
    url: `${API_URL}/menu/categories`
    //url: `${API_URL}/categories/list?searchCriteria[filterGroups][1][filters][0][field]=is_active&searchCriteria[filterGroups][1][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][field]=include_in_menu&searchCriteria[filterGroups][2][filters][0][value]=1`
    //url: `${API_URL}/categories/list?searchCriteria[filterGroups][0][filters][0][field]=parent_id&searchCriteria[filterGroups][0][filters][0][value]=2&searchCriteria[filterGroups][1][filters][0][field]=is_active&searchCriteria[filterGroups][1][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][field]=include_in_menu&searchCriteria[filterGroups][2][filters][0][value]=1`
  });
}

export function storeCategoriesList(categories) {
  return {
    type: SAVE_CATEGORIES,
    payload: categories
  };
}

export function fetchProduct(slug) {
  const user = getSessionItem('user');
  if (user && typeof user.token !== 'undefined') {
    return axios({
      method: 'GET',
      headers: { Authorization: `Bearer ${user.token}` },
      url: `${API_URL}/product/${slug}`
    });
  } else {
    return axios({
      method: 'GET',
      url: `${API_URL}/product/${slug}`
    });
  }
}

export function fetchConfigurableProductOptions(productId) {
  return axios({
    method: 'GET',
    url: `${API_URL}/config/product/options/${productId}`
  });
}

export function fetchProductOptionsBySku(sku) {
  return axios({
    method: 'GET',
    url: `${API_URL}/configurable-products/${sku}/options/all`
  });
}

export function fetchProductAttributesByOption(option) {
  return axios({
    method: 'GET',
    url: `${API_URL}/products/attributes/${option}/options`
  });
}

export function fetchUpSellingProduct(sku) {
  const user = getSessionItem('user');
  let headers = {};
  if (user && typeof user.token !== 'undefined') {
    headers = { Authorization: `Bearer ${user.token}` }
  }
  return axios({
    method: 'GET',
    headers: headers,
    url: `${API_URL}/upselling-products/${encodeURIComponent(sku)}`
  });
}

export function fetchRelatedProduct(sku) {
  const user = getSessionItem('user');
  let headers = {};
  if (user && typeof user.token !== 'undefined') {
    headers = { Authorization: `Bearer ${user.token}` }
  }
  return axios({
    method: 'GET',
    headers: headers,
    url: `${API_URL}/related-products/${encodeURIComponent(sku)}`
  });
}

export function fetchWishList(eventType = "") {
  return (dispatch) => {
    // Get customer token
    const user = getSessionItem("user");

    if (user && typeof user.token !== "undefined") {
      return axios({
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
        url: `${API_URL}/ipwishlist/items`,
      }).then((response) => {
        dispatch({
          type: SAVE_WISHLIST,
          payload: response.data,
        });

        // webEngage Events
        if (eventType === "removed") {
          const wishListItems = response.data;
          const product_details = [];
          let total_amount = 0;

          if (wishListItems && wishListItems.length > 0) {
            wishListItems.forEach((item) => {
              const product = item.product;
              const ob = {};
              total_amount += item.qty * product.final_price;
              ob["Product ID"] = `${product.entity_id}`;
              ob["Product Name"] = product.name;
              ob["Category Name"] = product.category;
              ob["Category Id"] = product.attribute_set_id;
              ob["Quantity"] = item.qty;
              ob["Retail Price"] = Number(product.price);
              ob["Discount"] = percentDiscount(
                product.price,
                product.final_price
              );
              ob["Price"] = Number(product.final_price);
              ob["Size"] = product.sku ? product.sku : "";
              ob["Image"] = [product.image ? `${MEDIA_BASE}/catalog/product/${product.image}` : ""];
              ob["Currency"] = "INR";
              product_details.push(ob);
            });
          }

          trackwebEngageEvent(WISHLIST_UPDATED, {
            "No. Of Products": wishListItems.length,
            // "Added to board": "",
            "Total Amount": total_amount,
            "Product Details": product_details,
          });
        }

        // if added to wishlish
        if (eventType === "added_to_wishlist") {
          webEngageAddedToWishList(response.data[response.data.length - 1]);
        }
      });
    }
  };
}

export function webEngageAddedToWishList(productInfo) {
  try {
    const product = productInfo.product;
    const discount = percentDiscount(product.price, product.final_price);
    const productDetail = {
      "Product ID": product.sku,
      "Product Name": product.name,
      "Category Name": product.category,
      "Category ID": product.attribute_set_id,
      "Retail Price": Number(product.price),
      "Discount": product.final_price - product.price,
      "Price": Number(product.final_price),
      "Currency": "INR",
      "Quantity": productInfo.qty ? productInfo.qty : 1,
      "Size": "",
      "Stock": product.x_left ? product.x_left : 1,
      "Image": [product.image ? `${MEDIA_BASE}/catalog/product/${product.image}` : ""],
    };
    trackwebEngageEvent(ADD_TO_WISHLIST, productDetail);
  } catch (error) {
    console.log(error);
  }
}

// export function fetchWishList() {
//   return new Promise((resolve, reject) => {
//     // Get customer token
//     const user = getSessionItem('user');
//     if(user && typeof user.token !== 'undefined'){
//       return axios({
//           method: 'GET',
//           headers: {Authorization: `Bearer ${user.token}`},
//           url: `${API_URL}/ipwishlist/items`
//       }).then(response => resolve(response));
//     }
//   });
// }

export function moveToWishList(productId) {
  const user = getSessionItem('user');
  //return (dispatch) => { 
  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
    url: `${API_URL}/ipwishlist/add/${productId}`
  });
  //};
}

export function moveToWishListSuccess(wishlistItem, productId) {
  return {
    type: UPDATE_WISHLIST_STATUS,
    payload: wishlistItem !== null,
    productId
  };
}

export function removeFromWishList(wishListItemId, productId) {
  const user = getSessionItem('user');
  return (dispatch) => {
    return axios({
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` },
      url: `${API_URL}/ipwishlist/delete/${wishListItemId}`
    }).then(response => {
      if (response.data !== true)
        return;
      user.mywishlist = user.mywishlist.filter(item => item.product_id !== productId);
      setSessionItem('user', user);
      dispatch({
        type: UPDATE_WISHLIST_STATUS,
        payload: false,
        productId
      });
    });
  };
}

export function fetchFlashSaleFilterAttributes(id, filters) {
  return axios({
    method: 'GET',
    params: { ...filters, id },
    hideError: 400,
    url: `${API_BASE}/datamigrate/flashSaleFilters.php`
  });
}

export function fetchCategoryFilterAttributes(category, filters) {
  if (category) {
    const categories = category.split(':');
    if (categories.length > 1) {
      category = categories[0];
    }
  }

  return axios({
    method: 'GET',
    params: category ? { ...filters, category } : filters,
    hideError: 400,
    url: `${API_URL}/catgory/filters`
  });
}

export function saveReview(productId, data) {
  const user = getSessionItem('user');
  return axios({
    method: 'POST',
    data: data,
    headers: { Authorization: `Bearer ${user.token}` },
    url: `${API_URL}/reviews/save/${productId}`
  });
}

export function fetchReviews(productId) {
  return axios({
    method: 'GET',
    url: `${API_URL}/reviews/${productId}`
  });
}

export function fetchTopRatedProducts() {
  return axios({
    method: 'GET',
    url: `${API_URL}/products/top/rated?searchCriteria[pageSize]=4&searchCriteria[currentPage]=1&searchCriteria[ratingCode]=Rating`
  });
}

export function checkPincodeAvailability(pincode) {
  return axios({
    method: 'GET',
    url: `${API_URL}/shipping/availability/${pincode}`
  });
}

export function subscribeForStockAlert(productId) {
  const user = getSessionItem('user');

  return axios({
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
    url: `${API_URL}/product/stock/alert/${productId}`
  });
}

export function fetchSearchResults(keyword) {
  if (cancelProductSearchRequest !== null) {
    cancelProductSearchRequest();
  }
  return axios({
    method: 'GET',
    params: { q: keyword, _: new Date().getTime() },
    url: `${API_BASE}/search/ajax/suggest`,
    cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancelProductSearchRequest = c;
    })
  });
}

export function saveProductsListToMemory(category, payload) {
  return {
    type: SAVE_PRODUCTS_LIST,
    category,
    payload
  }
}

export function getAllReviews(page) {
  return axios({
    method: 'GET',
    url: `${API_URL}/review-list-page/?pageSize=20&curPage=${page}`
  });
}