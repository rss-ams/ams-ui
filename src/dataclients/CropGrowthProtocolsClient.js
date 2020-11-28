import { API_URL, handleErrors } from 'utils/FetchUtils';

export const getAllCropGrowthProtocols = async () => {
  return fetch(API_URL + 'cropGrowthProtocols')
    .then(handleErrors)
    .then((response) => response.json());
};
