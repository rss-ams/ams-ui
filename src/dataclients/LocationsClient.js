import { handleErrors, API_URL } from 'utils/FetchUtils';

export const getLocations = async () => {
  return fetch(API_URL + 'fields/locations')
    .then(handleErrors)
    .then((response) => response.json());
};
