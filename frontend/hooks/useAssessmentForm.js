import { useMemo, useState } from 'react';
import {
  assessmentFields,
  createInitialAssessmentValues,
  fieldOrder,
  validateAssessmentValue
} from '../utils/assessmentConfig';

export function useAssessmentForm() {
  const [values, setValues] = useState(() => createInitialAssessmentValues());
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const fieldNames = useMemo(() => fieldOrder, []);

  function setFieldValue(fieldName, value) {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFieldValue(name, value);

    if (touched[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: validateAssessmentValue(name, value)
      }));
    }
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    setTouched((currentTouched) => ({
      ...currentTouched,
      [name]: true
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: validateAssessmentValue(name, value)
    }));
  }

  function validateAll() {
    const nextErrors = fieldNames.reduce((accumulator, fieldName) => {
      const validationError = validateAssessmentValue(fieldName, values[fieldName]);
      if (validationError) {
        accumulator[fieldName] = validationError;
      }
      return accumulator;
    }, {});

    setErrors(nextErrors);
    setTouched(fieldNames.reduce((accumulator, fieldName) => ({ ...accumulator, [fieldName]: true }), {}));

    return Object.keys(nextErrors).length === 0;
  }

  function resetForm() {
    setValues(createInitialAssessmentValues());
    setErrors({});
    setTouched({});
  }

  function hasError(fieldName) {
    return Boolean(touched[fieldName] && errors[fieldName]);
  }

  function getFieldMeta(fieldName) {
    return assessmentFields[fieldName];
  }

  return {
    values,
    errors,
    touched,
    hasError,
    getFieldMeta,
    handleChange,
    handleBlur,
    setFieldValue,
    validateAll,
    resetForm
  };
}
