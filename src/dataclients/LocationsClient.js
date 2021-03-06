import { handleErrors, API_URL } from 'utils/FetchUtils';

export const getLocations = async () => {
  return fetch(API_URL + 'fields/locations', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};
