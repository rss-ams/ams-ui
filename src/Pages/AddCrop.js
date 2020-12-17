import React, { useState } from 'react';
import CropForm from 'components/common/CropForm';

const AddCrop = () => {
  const [selectedRow] = useState({
    name: '',
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
