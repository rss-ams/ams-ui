import { API_URL, handleErrors } from 'utils/FetchUtils';

export const getProcessCategories = async () => {
  return fetch(API_URL + 'fieldCropCycles/processCategories', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};

export const getProcessStatuses = async () => {
  return fetch(`${API_URL}fieldCropCycles/processStatuses`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * Updates the specified process.
 * @param {number} cropCycleIdId ID of crop cycle whose process is being updated
 * @param {object} payload process details payload
 */
export const updateProcess = async (cropCycleId, payload) => {
  return fetch(`${API_URL}fieldCropCycles/${parseInt(cropCycleId)}/processes`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};
