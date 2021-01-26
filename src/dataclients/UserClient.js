import { API_URL, handleErrors } from 'utils/FetchUtils';

/**
 * API to create a new field
 * @param {object} payload
 */
export const createUser = async (payload) => {
  return fetch(API_URL + 'users', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};
