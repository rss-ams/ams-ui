import { API_URL, handleErrors } from 'utils/FetchUtils';

/**
 * API to create crop cycles
 * @param {*} payload
 */
export const createCropCycles = async (payload) => {
  return fetch(API_URL + 'fieldCropCycles/batch', {
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
 * API to fetch crop-cycles associated with the specified field
 *
 * @param {number} fieldId ID for the field
 */
export const getCropCyclesByField = async (fieldId) => {
  let url = `${API_URL}fieldCropCycles?fieldId=${parseInt(fieldId)}`;
  return fetch(url, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to update crop cycles
 * @param {object} payload
 */
export const updateCropCycles = async (payload) => {
  return fetch(API_URL + 'fieldCropCycles', {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to delete a cropcycle
 * @param {object} payload
 */
export const deleteCropCycle = async (id) => {
  return fetch(API_URL + 'fieldCropCycles/' + id, {
    method: 'DELETE',
  }).then(handleErrors);
};
