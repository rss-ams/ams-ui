export const fetchCropCycles = (fields,fieldIdentifier) => {
  let cropCycleList = [];
  let fieldSelected = fieldIdentifier;
  console.log("Fields"+fields);
  console.log("field selected:"+fieldSelected);
  fields.forEach(field => {
    if(field.identifier === fieldSelected)
    {
       cropCycleList = field.fieldCropCycles.map((fieldCropCycle) => {
        let dispCropCycle =
          fieldCropCycle.crop.name +
          '-' +
          fieldCropCycle.season +
          '-' +
          fieldCropCycle.year;
        let dispCropCycleObj = {
          id: fieldCropCycle.id,
          displayStr: dispCropCycle
        };
        return dispCropCycleObj;
      });
      
    }
    
  });
  console.log("Cropcyclelist:"+cropCycleList);
  return cropCycleList;
};