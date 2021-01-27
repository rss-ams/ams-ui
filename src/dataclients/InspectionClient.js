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
 * API to fetch Adhoc activities based on Inspection Types
 * 
 */
export const getAdhocActivities = async (fieldCropCycleId, inspectionValues) => {
  let qParam = "";
  inspectionValues.forEach((iValue) => {
    if (iValue.val === 0) {
      qParam = qParam + iValue.code + "=false&"
    }
    if (iValue.val === 1) {
      qParam = qParam + iValue.code + "=true&"
    }
  })
  if (fieldCropCycleId === '' || qParam === "")
    return [];
  return fetch(API_URL + 'fieldCropCycles/' + fieldCropCycleId + '/processes?' + qParam)
    .then(handleErrors)
    .then((response) => response.json());
};

/**
 * API to post inspection 
 * @param {*} payload 
 */

export const postInspection = async (payload, fieldCropCycleId) => {
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