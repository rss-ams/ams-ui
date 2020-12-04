import { API_URL, handleErrors } from 'utils/FetchUtils';

/**
 * API to fetch fields information
 * If location is provided, returns fields for a single location
 * @param {integer} location 
 */
export const getAllFields = async (location) => {
  let url = `${API_URL}fields`;
  if(Number.isInteger(location)){
    url = `${url}?location=${location}`;
  }
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
