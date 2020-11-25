import { API_URL, handleErrors } from 'utils/FetchUtils';

export const getAllFields = async () => {
  return fetch(API_URL + 'fields')
    .then(handleErrors)
    .then((response) => response.json());
};

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
