import { SIDE_FILTER } from "./products"

export function sideFilter(payload) {
    return (dispatch) => {
        dispatch({ type: SIDE_FILTER, payload: payload })
    }
}