import {
    SAVE_META_DATA,
    _dispatch
} from '../actions/seo';

const INITIAL_STATE = {}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {

        case SAVE_META_DATA:
            return _dispatch({ meta_data: action.payload }, true, 'meta_data');

        default:
            return state;
    }
}
