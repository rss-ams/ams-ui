import { API_URL, handleErrors } from 'utils/FetchUtils';

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
