import { API_URL, handleErrors } from 'utils/FetchUtils';

export const getProcessCategories = async () => {
  return fetch(API_URL + 'fieldCropCycles/processCategories')
    .then(handleErrors)
    .then((response) => response.json());
};
