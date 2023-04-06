//Staging Version : 
export const API_BASE = "https://stage-api.powerlook.in";
export const ROOT = "https://stage.powerlook.in";

export const API_URL = API_BASE + "/rest/default/V1";

export const MEDIA_BASE = API_BASE + "/pub/media";

export const MAGEAPI_INTEGRATION_KEY = "whqdnce54h0eozgiue2sl4ppslt16jev";

// Facebook Pixel ID
export const FBPIXELID = "365675530519883"; //'352910836081729'; //'365675530519883'; //'254603708580767';

// Google Analytics ID
export const GAID = "UA-125321256-1";

// Google Tag Manager ID
export const GTMID = "GTM-WHQJRCM";

// Social Login IDs
export const SOCIALFBID = "2932891560070188";
export const SOCIALGOOGLEID =
  "294381447264-6otqsq468eqekhijo0e4ikptdjsinnjt.apps.googleusercontent.com";

// PAYMENT GATEWAY
export const RAZORPAYLIVEID = "rzp_live_8e5EffVfcgo58o"; //'rzp_live_gRE5VjDbLlSdB6';
// export const RAZORPAYLIVEID = "rzp_test_NdZFS6bTU9xYio"; // staging ;


export const MAXREVIEWIMAGES = 3;
export const REVIEWIMAGESIZE = 1000; // 1000kb

export const SLIDERTYPE = {
  DISCOUNT: "1",
  PRODUCT: "2",
  CATEGORY: "3",
};

export const gender = ["", "Male", "Female", "Not Specified"];

export const STARRATING = {
  color: "#009662",
  stars: 5,
  emptyColor: "#ffff"
};

export const ORDERSTATUS = {
  canceled: {
    color: "red",
  },
  undelivered: {
    color: "red",
  },
  closed: {
    color: "red",
  },
  complete: {
    color: "#b39126",
  },
  delivered: {
    color: "#b39126",
  },
  dispatched: {
    color: "#b39126",
  },
  fraud: {
    color: "red",
  },
  holded: {
    color: "#b39126",
  },
  payment_review: {
    color: "#b39126",
  },
  pending: {
    color: "#B88D03",
  },
  pending_payment: {
    color: "#B88D03",
  },
  processing: {
    color: "#b39126",
  },
  rejected_by_admin: {
    color: "red",
  },
};

export const ORDERSTATE = {
  canceled: "Your order has been canceled",
  undelivered: "Unfortunately your order could not reach you",
  closed: "Closed",
  complete: "Your order is ready for pickup",
  delivered: "We have successfully delivered your order",
  dispatched: "Your order is on the way",
  fraud: "Suspected Fraud",
  holded: "Your order has been put on hold",
  payment_review: "Your payment is under review",
  pending: "Your order is under process",
  pending_payment: "Waiting for order payment release",
  processing: "Your order is under process",
};

export const RESOLUTIONTYPE = {
  RETURN: 0,
  EXCHANGE: 1,
};

export const RMASTATUS = [
  {
    0: {
      label: "Pending",
      color: "#B88D03",
    },
    1: {
      label: "Return in Transit",
      color: "#b39126",
    },
    4: {
      label: "Return Canceled",
      color: "red",
    },
    5: {
      label: "Declined",
      color: "#252931",
    },
    6: {
      label: "Refund Processed",
      color: "#b39126",
    },
  },
  {
    0: {
      label: "Pending",
      color: "#B88D03",
    },
    1: {
      label: "Exchange Approved",
      color: "#b39126",
    },
    2: {
      label: "Received Package",
      color: "#252931",
    },
    3: {
      label: "Dispatched Package",
      color: "#252931",
    },
    4: {
      label: "Exchange Canceled",
      color: "red",
    },
    5: {
      label: "Declined",
      color: "#252931",
    },
    6: {
      label: "Solved",
      color: "#b39126",
    },
  },
];

export const RMASTATE = [
  {
    pending: 0,
    return_approved: 1,
    declined: 5,
    canceled: 4,
    refund_initiated: 6,
  },
  {
    pending: 0,
    exchange_approved: 1,
    package_received: 2,
    package_dispatched: 3,
    canceled: 4,
    declined: 5,
    solved: 6,
  },
];

export const REFUNDMODE = {
  BACK_TO_SOURCE: 1,
  BANK_ACCOUNT: 2,
  WALLET: 3,
};


export const USER_LOGGED_IN = "User Logged In"
export const USER_SIGNED_UP="User Signed Up"
export const SIGN_UP_FOR_NEWSLETTER="Signed up for Newsletter"
export const PRODUCT_SEARCHED="Product Searched"
export const BANNER_CLICKED="Banner Clicked"
export const PRODUCT_VIEW="Product Viewed"
export const ADD_TO_BAG="Add to Bag"
export const CATEGORY_VIEWED="Category Viewed"
export const ADD_TO_WISHLIST="Add To Wishlist"
export const CART_UPDATED="Cart Updated"
export const WISHLIST_UPDATED="Wishlist Updated"
export const COUPAN_CODE_APPLIED="Coupon Code Applied"
export const COUPAN_CODE_FAILED="Coupon Code Failed"
export const CART_VIEWD="Cart Viewed"
export const REMOVED_FROM_CART = "Removed from Cart"
export const CHECKOUT_STARTED="Checkout Started"
export const CHECKOUT_COMPLETED="Checkout Completed"
export const PAYMENT_FAILURE="Payment Failure"
export const SHIPPING_DETAILS_UPDATED="Shipping Details Updated"
export const ORDER_dELIVERD="Order Delivered"
export const ORDER_REFUND_COMPLETED="Order Refund Completed"
export const ORDER_RETURN_INTIATED="Order Return Intiated"
export const ORDER_RETURN_COMPLETED="Order Return Completed"
export const ORDER_CANCELLED="Order Cancelled"
export const FILTER="Filters"
export const SOCIAL="Social"
export const VIDEO_BANNER="Video Banner"
export const TRACK_ORDER="Track Order"
export const ADD_NEW_ADDRESS="Add New Address"
export const EDIT_ADDRESS="Edit Address"
export const DELETE_ADDRESS="Delete address"    
