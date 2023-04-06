import axios from 'axios';
import {store} from '../store';
import { API_URL } from '../constants';
import {getSessionItem, setSessionItem, _dispatch} from '../utilities';
export {_dispatch};

export function fetchOrderDetailsForRma(orderId){
  const user = getSessionItem('user');

  return axios({
      method: 'GET',
      headers: {Authorization: `Bearer ${user.token}`},
      url: `${API_URL}/rma/new-request/${orderId}`
  });
}

export function saveRmaRequest(orderId, data){
  const user = getSessionItem('user');

  return axios({
      method: 'POST',
     // headers: {Authorization: `Bearer ${user.token}`},
      data: data,
      url: `${API_URL}/rma/save/${orderId}`
  });
}

export function fetchRmasList() {
  const user = getSessionItem('user');

  return axios({
      method: 'GET',
      headers: {Authorization: `Bearer ${user.token}`},
      url: `${API_URL}/rma/list`,
  });
}

export function fetchRmaDetail(rmaId) {
  const user = getSessionItem('user');

  return axios({
      method: 'GET',
      headers: {Authorization: `Bearer ${user.token}`},
      url: `${API_URL}/rma/detail/${rmaId}`,
  });
}

export function cancelRmaItem(itemId, rmaId) {
  const user = getSessionItem('user');

  return axios({
      method: 'GET',
      headers: {Authorization: `Bearer ${user.token}`},
      url: `${API_URL}/rma/${rmaId}/cancel/item/${itemId}`,
  });
}

export function cancelRma(rmaId) {
  const user = getSessionItem('user');

  return axios({
      method: 'GET',
      headers: {Authorization: `Bearer ${user.token}`},
      url: `${API_URL}/rma/cancel/${rmaId}`,
  });
}

export function updateRma(rmaId, data) {
  const user = getSessionItem('user');

  return axios({
      method: 'POST',
      data: data,
      headers: {Authorization: `Bearer ${user.token}`},
      url: `${API_URL}/rma/update/${rmaId}`,
  });
}