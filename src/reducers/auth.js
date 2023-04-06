import {
  SAVE_AUTH,
  SAVE_OTP,
  _dispatch
} from '../actions/auth';

import {
  UPDATE_AUTH
} from '../actions/customer';

const INITIAL_STATE = { auth: false, status: null }

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {

    case SAVE_AUTH:
      return _dispatch({ ...state, auth: action.payload }, true, 'auth');

    case UPDATE_AUTH:
      return _dispatch({ ...state }, true, 'auth');

    case SAVE_OTP:
      return _dispatch({ ...state, 'otp': action.payload })

    default:
      return state;
  }
}