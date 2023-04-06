import { load } from './utilities';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { isMobile } from './utilities';

export const ROUTES = {
  HOME: {
    path: '/',
    exact: true,
    component: load('Home')
  },

  LOGIN: {
    path: '/login',
    exact: true,
    component: load('Login')
  },

  LOGOUT: {
    path: '/logout',
    exact: true,
    component: load('Logout')
  },

  CATALOGSEARCH: {
    path: '/catalog-search',
    exact: true,
    component: load('CatalogSearchResults')
  },

  PRODUCTLIST: {
    path: '/product-category/:category',
    exact: true,
    component: load('ProductsList')
  },

  SUBCATEGORYPRODUCTLIST: {
    path: '/product-category/:category/:subcategory',
    exact: true,
    component: load('ProductsList')
  },

  PRODUCTDETAIL: {
    path: '/shop/:category/:product',
    exact: true,
    component: load('ProductDetail')
  },

  SUBCATPRODUCTDETAIL: {
    path: '/shop/:category/:subcategory/:product',
    exact: true,
    component: load('SubCategoryProductDetail')
  },

  CHECKOUT: {
    path: '/checkout',
    exact: false,
    component: isMobile() ? load('CheckoutMobile') : load('Checkout')
  },

  CHECKOUTADDRESS: {
    path: '/checkout/address',
    exact: true,
    component: load('mobile/CheckoutAddress')
  },

  CHECKOUTADDADDRESS: {
    path: '/checkout/add-address',
    exact: true,
    component: load('mobile/CheckoutAddAddress')
  },

  CHECKOUTPLACEORDER: {
    path: '/checkout/place-order',
    exact: true,
    component: load('checkout/CheckoutPlaceOrder')
  },

  SHOPPINGBAG: {
    path: '/shopping-bag',
    exact: true,
    component: load('Shoppingbag')
  },

  ORDERCONFIRMED: {
    path: '/order/success',
    exact: true,
    component: load('OrderConfirmed')
  },

  CUSTOMERACCOUNT: {
    path: '/account',
    exact: false,
    component: load('CustomerAccount')
  },

  VIEWPROFILE: {
    path: '/account',
    exact: true,
    component: load('customer/ViewProfile')
  },

  EDITPROFILE: {
    path: '/account/profile/edit',
    exact: true,
    component: load('customer/EditProfile')
  },

  SAVEDADDRESSES: {
    path: '/account/myaddresses',
    exact: true,
    component: load('customer/SavedAddresses')
  },

  ORDERSLIST: {
    path: '/account/myorders',
    exact: true,
    component: load('customer/OrdersList')
  },

  ORDERDETAIL: {
    path: '/account/myorders/detail/:orderId',
    exact: true,
    component: load('customer/OrderDetail')
  },

  RMALIST: {
    path: '/account/returns',
    exact: true,
    component: load('rma/RmaList')
  },

  NEWRMA: {
    path: '/account/rma/new/:orderId',
    exact: true,
    component: load('rma/NewRequest')
  },

  VIEWRMA: {
    path: '/account/rma/detail/:rmaId',
    exact: true,
    component: load('rma/ViewRmaDetail')
  },

  WISHLIST: {
    path: '/account/mywishlist',
    exact: true,
    component: load('customer/WishListItemsList')
  },

  CHANGEPASSWORD: {
    path: '/account/changepassword',
    exact: true,
    component: load('customer/ChangePassword')
  },

  STATICPAGE: {
    path: '/:pageSlug',
    exact: true,
    component: load('StaticPage')
  },

  STORES: {
    path: '/stores',
    exact: true,
    component: load('StoreLocator')
  },

  CONTACTUS: {
    path: '/contactus',
    exact: true,
    component: load('ContactUs')
  },

  FLASHSALE: {
    path: '/flash-sale/:id',
    exact: true,
    component: load('FlashSale')
  },

  MYWALLET: {
    path: '/account/mywallet',
    exact: true,
    component: load('customer/Wallet')
  },

  CHECKDELIVERY: {
    path: '/check-delivery-availability',
    exact: true,
    component: load('CheckDelivery')
  },

  CHECKDELIVERYRESULT: {
    path: '/check-delivery-availability/:pincode',
    exact: true,
    component: load('CheckDeliveryResult')
  },
  REVIEWS: {
    path: '/reviews/detail',
    exact: true,
    component: load('reviews/Reviews')
  },
  WIZZY: {
    path: '/pages/search',
    exact: true,
    component: load('wizzy-components/WizzySearchScreen')
  },


  // DELIVERY: { 
  //   path: '/checkout/delivery',
  //   exact: true,
  //   component: load('checkout/DeliveryBlock')
  // },

  NOTFOUND: {
    path: '/page-not-found',
    exact: true,
    component: load('PageNotFound')
  }
};