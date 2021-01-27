import { API_URL, handleErrors } from 'utils/FetchUtils';

/**
 * API to fetch all fields information
 *
 */
export const getAllFields = async () => {
  let url = `${API_URL}fields`;
  return fetch(url, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
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
  return fetch(url, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
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
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to update a field
 * @param {object} payload
 */
export const updateField = async (payload) => {
  return fetch(API_URL + 'fields', {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to delete a field
 * @param {object} payload
 */
export const deleteField = async (id) => {
  return fetch(API_URL + 'fields/' + id, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  }).then(handleErrors);
};
