import { API_URL, handleErrors } from 'utils/FetchUtils';

/**
 * Count to fetch all inspections for the crop cycle. Assuming there won't be
 * more than 100 inspections for a crop cycle.
 */
const COUNT_TO_FETCH_ALL_INSPECTION_FOP_A_CROP_CYCLE = 100;

/**
 * Fetches all the inspections for the specified crop cycle
 *
 * @param {number} cropCycleId ID of the crop cycle whose inspections are to be fetched
 * @returns An array of inspection objects
 */
export const getAllInspectionsByCropCycle = async (cropCycleId) => {
  return fetch(
    `${API_URL}fieldCropCycles/${parseInt(
      cropCycleId,
    )}/inspections?size=${COUNT_TO_FETCH_ALL_INSPECTION_FOP_A_CROP_CYCLE}`,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    },
  )
    .then(handleErrors)
    .then((response) => response.json())
    .then((data) => data.content);
};
