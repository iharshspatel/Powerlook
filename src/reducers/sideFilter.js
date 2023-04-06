import { SIDE_FILTER, _dispatch } from '../actions/products';

const INITIAL_STATE = {}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {

        case SIDE_FILTER:
            return _dispatch({ ...state, payload: action.payload });

        default:
            return state;
    }
}
