import React, { useState } from 'react';
import FieldForm from 'components/common/FieldForm';

const AddField = () => {
  const [selectedRow] = useState({
    locationCode: '',
    name: '',
    area: '',
  });

  return (
    <FieldForm
      operation='CREATE'
      title='Add Field'
      selectedRow={selectedRow}
      submitButtonText='Create'
    />
  );
};

export default AddField;
