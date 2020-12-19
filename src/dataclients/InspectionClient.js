import { handleErrors, API_URL } from 'utils/FetchUtils';


/**
 * API to fetch available Inspection Types
 * 
 */
export const getInspectionParams = async () => {
  return fetch(API_URL + 'fieldCropCycles/inspectionTypes')
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to post inspection 
 * @param {*} payload 
 */

export const postInspection = async (payload,fieldCropCycleId) => {
  return fetch(API_URL + 'fieldCropCycles/' + fieldCropCycleId + '/inspections', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(handleErrors)
    .then((response) => response.json());
};