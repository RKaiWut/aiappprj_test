export const sexOptions = [
  { label: 'Female', value: 0 },
  { label: 'Male', value: 1 }
];

export const chestPainOptions = [
  { label: 'Typical angina', value: 1 },
  { label: 'Atypical angina', value: 2 },
  { label: 'Non-anginal pain', value: 3 },
  { label: 'Asymptomatic', value: 4 }
];

export const yesNoOptions = [
  { label: 'No', value: 0 },
  { label: 'Yes', value: 1 }
];

export const restingEcgOptions = [
  { label: 'Normal', value: 0 },
  { label: 'ST-T wave abnormality', value: 1 },
  { label: 'Left ventricular hypertrophy', value: 2 }
];

export const slopeOptions = [
  { label: 'Upsloping', value: 1 },
  { label: 'Flat', value: 2 },
  { label: 'Downsloping', value: 3 }
];

export const thalOptions = [
  { label: 'Normal', value: 3 },
  { label: 'Fixed defect', value: 6 },
  { label: 'Reversible defect', value: 7 }
];

export const caOptions = [
  { label: '0 major vessels', value: 0 },
  { label: '1 major vessel', value: 1 },
  { label: '2 major vessels', value: 2 },
  { label: '3 major vessels', value: 3 },
  { label: '4 major vessels', value: 4 }
];

export const assessmentFields = {
  age: {
    name: 'age',
    label: 'Age',
    kind: 'number',
    inputType: 'number',
    min: 18,
    max: 100,
    step: 1,
    helper: 'Age in years.',
    placeholder: 'e.g. 54'
  },
  sex: {
    name: 'sex',
    label: 'Sex',
    kind: 'select',
    options: sexOptions,
    helper: 'Recorded biological sex used by the trained model.'
  },
  cp: {
    name: 'cp',
    label: 'Chest Pain Type',
    kind: 'select',
    options: chestPainOptions,
    helper: 'Select the closest category from the clinical description.'
  },
  trestbps: {
    name: 'trestbps',
    label: 'Resting Blood Pressure',
    kind: 'number',
    inputType: 'number',
    min: 50,
    max: 250,
    step: 1,
    helper: 'Resting systolic blood pressure in mmHg.',
    placeholder: 'e.g. 130'
  },
  chol: {
    name: 'chol',
    label: 'Cholesterol',
    kind: 'number',
    inputType: 'number',
    min: 100,
    max: 700,
    step: 1,
    helper: 'Serum cholesterol in mg/dL.',
    placeholder: 'e.g. 230'
  },
  fbs: {
    name: 'fbs',
    label: 'Fasting Blood Sugar',
    kind: 'select',
    options: yesNoOptions,
    helper: 'Whether fasting blood sugar is above 120 mg/dL.'
  },
  restecg: {
    name: 'restecg',
    label: 'Rest ECG',
    kind: 'select',
    options: restingEcgOptions,
    helper: 'Resting electrocardiogram result.'
  },
  thalach: {
    name: 'thalach',
    label: 'Maximum Heart Rate',
    kind: 'number',
    inputType: 'number',
    min: 60,
    max: 250,
    step: 1,
    helper: 'Highest heart rate reached during exercise.',
    placeholder: 'e.g. 150'
  },
  exang: {
    name: 'exang',
    label: 'Exercise Induced Angina',
    kind: 'select',
    options: yesNoOptions,
    helper: 'Chest pain triggered by exercise.'
  },
  oldpeak: {
    name: 'oldpeak',
    label: 'ST Depression (Oldpeak)',
    kind: 'number',
    inputType: 'number',
    min: 0,
    max: 10,
    step: 0.1,
    helper: 'ST depression induced by exercise relative to rest.',
    placeholder: 'e.g. 1.2'
  },
  slope: {
    name: 'slope',
    label: 'ST Slope',
    kind: 'select',
    options: slopeOptions,
    helper: 'Shape of the peak exercise ST segment.'
  },
  ca: {
    name: 'ca',
    label: 'Number of Major Vessels',
    kind: 'select',
    options: caOptions,
    helper: 'Count of major vessels colored by fluoroscopy.'
  },
  thal: {
    name: 'thal',
    label: 'Thalassemia',
    kind: 'select',
    options: thalOptions,
    helper: 'Thalassemia test category used during training.'
  }
};

export const assessmentFieldGroups = [
  {
    id: 'personal-information',
    title: 'Personal Information',
    description: 'Basic patient context used by the trained model.',
    fields: ['age', 'sex']
  },
  {
    id: 'symptoms',
    title: 'Symptoms',
    description: 'Reported chest pain and exercise response.',
    fields: ['cp', 'exang']
  },
  {
    id: 'clinical-measurements',
    title: 'Clinical Measurements',
    description: 'Vital signs and core lab measurements.',
    fields: ['trestbps', 'chol', 'thalach', 'fbs']
  },
  {
    id: 'ecg-clinical-findings',
    title: 'ECG / Clinical Findings',
    description: 'Cardiac indicators and imaging-derived findings.',
    fields: ['restecg', 'oldpeak', 'slope', 'ca', 'thal']
  }
];

export const fieldOrder = [
  'age',
  'sex',
  'cp',
  'trestbps',
  'chol',
  'fbs',
  'restecg',
  'thalach',
  'exang',
  'oldpeak',
  'slope',
  'ca',
  'thal'
];

export function createInitialAssessmentValues() {
  return fieldOrder.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = '';
    return accumulator;
  }, {});
}

export function getFieldDefinition(fieldName) {
  return assessmentFields[fieldName];
}

export function validateAssessmentValue(fieldName, value) {
  const field = getFieldDefinition(fieldName);

  if (!field) {
    return '';
  }

  if (value === '' || value === null || value === undefined) {
    return `${field.label} is required.`;
  }

  if (field.kind === 'select') {
    const optionValues = field.options.map((option) => String(option.value));
    if (!optionValues.includes(String(value))) {
      return `Select a valid ${field.label.toLowerCase()} option.`;
    }
    return '';
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return `${field.label} must be a number.`;
  }

  if (typeof field.min === 'number' && numericValue < field.min) {
    return `${field.label} must be at least ${field.min}.`;
  }

  if (typeof field.max === 'number' && numericValue > field.max) {
    return `${field.label} must be ${field.max} or less.`;
  }

  return '';
}
