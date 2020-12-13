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
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};


/**
 * API to fetch crop cycles based on field ID
 * @param {integer} fieldId 
 */
export const getCropCyclesByField = async (fieldId) => {
  let url = `${API_URL}fieldCropCycles?fieldId=${fieldId}`;
  return fetch(url)
    .then(handleErrors)
    .then((response) => response.json());
};
