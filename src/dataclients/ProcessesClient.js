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

export const getCropCycleForProcess = async (processCode) => {
  return fetch(`${API_URL}fieldCropCycles?processCode=` + processCode, {
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
 * API to post activity
 * @param {*} payload
 */

export const postProcess = async (payload, fieldCropCycleId) => {
  return fetch(API_URL + 'fieldCropCycles/' + fieldCropCycleId + '/processes', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to post batch activity
 * @param {*} payload
 */

export const postBatchProcess = async (payload, fieldCropCycleId) => {
  return fetch(
    API_URL + 'fieldCropCycles/' + fieldCropCycleId + '/processes/batch',
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    },
  )
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
