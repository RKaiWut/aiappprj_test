import { buildAssessmentPayload } from '../utils/payload';
import { getLifestyleAdvice, getRiskLevel } from '../utils/risk';

const DEFAULT_API_BASE_URL = 'http://localhost:8000';

function clamp(value, min, max) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(max, Math.max(min, value));
}

function isPresent(value) {
  return value !== null && value !== undefined && value !== '';
}

function normalizeApiResponse(data) {
  return {
    prediction: data.prediction,
    rawProbability: data.raw_probability,
    riskProbability: data.risk_probability,
    riskPercent: `${data.risk_percent.toFixed(1)}%`,
    riskLevel: data.risk_level,
    topFactors: data.top_factors ?? [],
    lifestyleAdvice: data.lifestyle_advice ?? getLifestyleAdvice(data.risk_level),
    medicalDisclaimer: data.medical_disclaimer ?? ''
  };
}

function buildStubFactors(payload) {
  const factors = [];

  if (isPresent(payload.age) && payload.age >= 60) {
    factors.push({ feature: 'Age', impact: 0.28, direction: 'increase' });
  }
  if (isPresent(payload.chol) && payload.chol >= 240) {
    factors.push({ feature: 'Cholesterol', impact: 0.24, direction: 'increase' });
  }
  if (isPresent(payload.trestbps) && payload.trestbps >= 140) {
    factors.push({ feature: 'Resting blood pressure', impact: 0.18, direction: 'increase' });
  }
  if (isPresent(payload.thalach) && payload.thalach <= 140) {
    factors.push({ feature: 'Maximum heart rate', impact: 0.16, direction: 'increase' });
  }
  if (payload.exang === 1) {
    factors.push({ feature: 'Exercise induced angina', impact: 0.22, direction: 'increase' });
  }
  if (isPresent(payload.oldpeak) && payload.oldpeak >= 1.5) {
    factors.push({ feature: 'ST depression', impact: 0.2, direction: 'increase' });
  }

  return factors.slice(0, 4);
}

export function buildStubPrediction(payload) {
  const ageScore = isPresent(payload.age) ? clamp((payload.age - 35) / 70, 0, 1) * 0.18 : 0;
  const bpScore = isPresent(payload.trestbps) ? clamp((payload.trestbps - 110) / 90, 0, 1) * 0.16 : 0;
  const cholScore = isPresent(payload.chol) ? clamp((payload.chol - 180) / 180, 0, 1) * 0.16 : 0;
  const heartRateScore = isPresent(payload.thalach) && payload.thalach < 150 ? clamp((150 - payload.thalach) / 100, 0, 1) * 0.14 : 0;
  const symptomScore = payload.exang === 1 ? 0.12 : 0;
  const ecgScore = isPresent(payload.oldpeak) && payload.oldpeak >= 1 ? clamp(payload.oldpeak / 5, 0, 1) * 0.16 : 0;
  const vesselScore = isPresent(payload.ca) ? clamp(payload.ca / 4, 0, 1) * 0.12 : 0;

  const riskProbability = clamp(0.08 + ageScore + bpScore + cholScore + heartRateScore + symptomScore + ecgScore + vesselScore, 0.05, 0.95);
  const riskLevel = getRiskLevel(riskProbability);

  return {
    prediction: riskProbability >= 0.5 ? 1 : 0,
    rawProbability: riskProbability,
    riskProbability,
    riskPercent: `${(riskProbability * 100).toFixed(1)}%`,
    riskLevel,
    topFactors: buildStubFactors(payload),
    lifestyleAdvice: getLifestyleAdvice(riskLevel),
    medicalDisclaimer: 'Stub result generated locally because the backend is not reachable yet.'
  };
}

export async function submitAssessment(values) {
  const payload = buildAssessmentPayload(values);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

  try {
    const response = await fetch(`${apiBaseUrl}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Prediction request failed with status ${response.status}`);
    }

    const data = await response.json();
    return normalizeApiResponse(data);
  } catch {
    return buildStubPrediction(payload);
  }
}
