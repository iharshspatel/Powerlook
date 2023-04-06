import {
  SAVE_LAYOUT,
  SAVE_PRODUCT_BLOCKS,
  SAVE_WEB_HERO_SLIDER,
  SAVE_MOBILE_HERO_SLIDER,
  SAVE_TOP_RATED_PRODUCTS,
  SAVE_AD_BLOCKS,
  TOPBAR,
  _dispatch
} from '../actions/home';

const INITIAL_STATE = {components: {}, products: [], adBlocks: [], webHeroSlider: null, mobileHeroSlider: null, topRatedProducts: null, topbar: {}}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {

    case SAVE_LAYOUT:
      return _dispatch({ ...state, components: action.payload }, true, 'home_layout');
      break;

    case SAVE_PRODUCT_BLOCKS:
    	const {payload, index} = action;
    	let products = [...state.products];
    	products[index] = payload;
      	return { ...state, products };
      	break;

    case SAVE_AD_BLOCKS:
      let adBlocks = [...state.adBlocks];
      adBlocks[action.index] = action.payload;
        return { ...state, adBlocks };
        break;

    case SAVE_WEB_HERO_SLIDER:
      	return { ...state, webHeroSlider: action.payload };
      	break;

    case SAVE_MOBILE_HERO_SLIDER:
      	return { ...state, mobileHeroSlider: action.payload };
      	break;

    case SAVE_TOP_RATED_PRODUCTS:
      	return { ...state, topRatedProducts: action.payload };
      	break;

    case TOPBAR:
        return _dispatch({...state, topbar: action.payload }, true, 'topbar');

    default:
      return state;
  }
}