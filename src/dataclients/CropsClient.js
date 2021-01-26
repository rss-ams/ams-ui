import { API_URL, handleErrors } from 'utils/FetchUtils';

export const createCrop = async (payload) => {
  return fetch(API_URL + 'crops', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to update a crop
 * @param {object} payload
 */
export const updateCrop = async (payload) => {
  return fetch(API_URL + 'crops', {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};

export const getAllCrops = async () => {
  return fetch(API_URL + 'crops')
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to delete a crop
 * @param {object} payload
 */
export const deleteCrop = async (id) => {
  return fetch(API_URL + 'crops/' + id, {
    method: 'DELETE',
  }).then(handleErrors);
};
