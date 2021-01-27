import { API_URL, handleErrors } from 'utils/FetchUtils';

export const getAllCropGrowthProtocols = async () => {
  return fetch(API_URL + 'cropGrowthProtocols', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};
