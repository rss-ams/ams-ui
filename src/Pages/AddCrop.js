import CropForm from 'components/common/CropForm';
import React, { useState } from 'react';

const AddCrop = () => {
  const [selectedRow] = useState({
    cropName: '',
    season: '',
    cgpid: '',
  });

  return (
    <CropForm
      operation='CREATE'
      title='Add Crop'
      selectedRow={selectedRow}
      submitButtonText='Create'
    />
  );
};

export default AddCrop;
