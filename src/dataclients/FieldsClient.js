import { API_URL, handleErrors } from 'utils/FetchUtils';

/**
 * API to fetch all fields information
 *
 */
export const getAllFields = async () => {
  let url = `${API_URL}fields`;
  return fetch(url)
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to fetch fields information for a single location
 *
 * @param {integer} location
 */
export const getFieldsByLocation = async (location) => {
  let url = `${API_URL}fields?location=${parseInt(location)}`;
  return fetch(url)
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to create a new field
 * @param {object} payload
 */
export const createField = async (payload) => {
  return fetch(API_URL + 'fields', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};
