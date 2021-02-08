import { handleErrors, API_URL } from 'utils/FetchUtils';

/**
 * API to fetch available Inspection Types
 *
 */
export const getInspectionParams = async () => {
  return fetch(API_URL + 'fieldCropCycles/inspectionTypes', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to fetch Adhoc activities based on Inspection Types
 *
 */
export const getAdhocProcesses = async (fieldCropCycleId, qParam) => {
  return fetch(
    API_URL + 'fieldCropCycles/' + fieldCropCycleId + '/processes?' + qParam,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    },
  )
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to post inspection
 * @param {*} payload
 */

export const postInspection = async (payload, fieldCropCycleId) => {
  return fetch(
    API_URL + 'fieldCropCycles/' + fieldCropCycleId + '/inspections',
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
 * API to post inspections batch
 * @param {*} payload
 */

export const postBatchInspection = async (payload, fieldCropCycleId) => {
  return fetch(
    API_URL + 'fieldCropCycles/' + fieldCropCycleId + '/inspections/batch',
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
