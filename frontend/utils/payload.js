import { fieldOrder } from './assessmentConfig';

export function toNumber(value) {
  return value === '' || value === null || value === undefined ? null : Number(value);
}

export function isAnsweredValue(value) {
  return value !== '' && value !== null && value !== undefined;
}

export function buildAssessmentPayload(values) {
  return fieldOrder.reduce((payload, fieldName) => {
    payload[fieldName] = toNumber(values[fieldName]);
    return payload;
  }, {});
}

export function isCompleteAssessmentPayload(payload) {
  return fieldOrder.every((fieldName) => payload[fieldName] !== null && payload[fieldName] !== undefined);
}

export function getAnsweredFieldNames(values) {
  return fieldOrder.filter((fieldName) => isAnsweredValue(values[fieldName]));
}
