import FieldForm from 'components/common/FieldForm';
import React, { useState } from 'react';

const AddField = () => {
  const [selectedRow] = useState({
    locationCode: '',
    fieldName: '',
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
