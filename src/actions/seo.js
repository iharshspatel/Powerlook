import axios from 'axios';
import { API_URL } from '../constants';
import { _dispatch } from '../utilities';
export { _dispatch };
export const SAVE_META_DATA = 'SAVE_META_DATA';

export function getMetaData(page, section) {
    return (dispatch) => {
        return axios({
            method: 'GET',
            url: `${API_URL}/meta/details?type=${page}&section=${section}`,
        }).then(response => {
            const data = response.data.length ? response.data[0] : {}
            document.title = data !== {} && data !== null ? data.meta_title : 'Powerlook'
            dispatch({
                type: SAVE_META_DATA,
                payload: { seo: data }
            });
        });
    };

}