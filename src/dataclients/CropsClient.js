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

export const getAllCrops = async () => {
  return fetch(API_URL + 'crops')
    .then(handleErrors)
    .then((response) => response.json());
};
