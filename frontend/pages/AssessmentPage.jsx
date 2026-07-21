import PrimaryButton from '../components/PrimaryButton';
import Disclaimer from '../components/Disclaimer';
import FormField from '../components/FormField';
import SectionCard from '../components/SectionCard';
import {
  assessmentFieldGroups,
  assessmentSteps,
  fieldOrder,
  getFieldDefinition,
  stepFieldMap
} from '../utils/assessmentConfig';
import { buildAssessmentPayload } from '../utils/payload';
import { useAssessmentForm } from '../hooks/useAssessmentForm';
import { useMemo, useState } from 'react';

function formatFieldValue(field, value) {
  if (value === '' || value === null || value === undefined) {
    return 'Not provided';
  }

  if (field.kind === 'select') {
    const option = field.options.find((entry) => String(entry.value) === String(value));
    return option ? option.label : 'Not provided';
  }

  return String(value);
}

export default function AssessmentPage({ onSubmitAssessment, loading, onCancel }) {
  const [stepIndex, setStepIndex] = useState(0);
  const { values, errors, handleChange, handleBlur, validateAll, getAnsweredCount, getAnsweredNames } = useAssessmentForm();

  const answeredFieldNames = getAnsweredNames();
  const answeredSet = useMemo(() => new Set(answeredFieldNames), [answeredFieldNames]);
  const currentStep = assessmentSteps[stepIndex];

  const stepFieldNames = currentStep?.id && stepFieldMap[currentStep.id] ? stepFieldMap[currentStep.id] : [];
  const currentFields = stepFieldNames.map((fieldName) => getFieldDefinition(fieldName)).filter(Boolean);

  const canGoPrevious = stepIndex > 0;
  const canGoNext = stepIndex < assessmentSteps.length - 1;

  function goNext() {
    setStepIndex((current) => Math.min(current + 1, assessmentSteps.length - 1));
  }

  function goPrevious() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function goToStep(nextStepIndex) {
    setStepIndex(nextStepIndex);
  }

  function renderStepSummary() {
    return (
      <aside className="assessment-progress" aria-label="Assessment progress">
        <SectionCard title="Your progress" description="Always visible so you can see what you have already answered.">
          <div className="progress-metric">
            <strong>{getAnsweredCount()}</strong>
            <span>of {fieldOrder.length} answered</span>
          </div>
          <div className="progress-list">
            {fieldOrder.map((fieldName) => {
              const field = getFieldDefinition(fieldName);
              const answered = answeredSet.has(fieldName);

              return (
                <div key={fieldName} className={answered ? 'progress-item progress-item--done' : 'progress-item'}>
                  <span>{answered ? '✓' : '•'}</span>
                  <span>{field.label}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </aside>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateAll()) {
      return;
    }

    const payload = buildAssessmentPayload(values);
    await onSubmitAssessment(payload);
  }

  return (
    <div className="page-stack">
      <div className="assessment-layout">
        <div className="assessment-main">
          <SectionCard title="Assessment" description="Short steps, plain language, and optional clinic-only details.">
            <div className="stepper" aria-label="Assessment steps">
              {assessmentSteps.map((step, index) => {
                const isActive = index === stepIndex;
                const isDone = index < stepIndex;

                return (
                  <button
                    key={step.id}
                    type="button"
                    className={isActive ? 'stepper-item stepper-item--active' : isDone ? 'stepper-item stepper-item--done' : 'stepper-item'}
                    onClick={() => goToStep(index)}
                  >
                    <span className="stepper-item__index">{index + 1}</span>
                    <span className="stepper-item__text">
                      <strong>{step.title}</strong>
                      <small>{step.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            <form className="assessment-form" onSubmit={handleSubmit} noValidate>
              {currentStep?.id === 'intro' ? (
                <div className="assessment-intro">
                  <p>This quick check uses your age, sex, symptoms, and any clinic measurements you already know.</p>
                  <p>Only fill in what you can see or remember. Things you don't remember can stay blank.</p>
                  <ul>
                    <li>It should take only a few minutes!</li>
                    <li>You can check your progress on the side..</li>
                    <li>Fields that require your ECG (medical) results are optional.</li>
                  </ul>
                </div>
              ) : currentStep?.id === 'review' ? (
                <div className="assessment-review">
                  <div className="assessment-review__section">
                    <h3>Answered</h3>
                    <div className="assessment-review__list">
                      {fieldOrder.filter((fieldName) => values[fieldName] !== '' && values[fieldName] !== null && values[fieldName] !== undefined).length ? (
                        fieldOrder
                          .filter((fieldName) => values[fieldName] !== '' && values[fieldName] !== null && values[fieldName] !== undefined)
                          .map((fieldName) => {
                            const field = getFieldDefinition(fieldName);
                            return (
                              <div key={fieldName} className="assessment-review__item">
                                <strong>{field.label}</strong>
                                <span>{formatFieldValue(field, values[fieldName])}</span>
                              </div>
                            );
                          })
                      ) : (
                        <p>No answers yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="assessment-review__section">
                    <h3>Still blank</h3>
                    <div className="assessment-review__list">
                      {fieldOrder.filter((fieldName) => values[fieldName] === '' || values[fieldName] === null || values[fieldName] === undefined).length ? (
                        fieldOrder
                          .filter((fieldName) => values[fieldName] === '' || values[fieldName] === null || values[fieldName] === undefined)
                          .map((fieldName) => {
                            const field = getFieldDefinition(fieldName);
                            return (
                              <div key={fieldName} className="assessment-review__item assessment-review__item--muted">
                                <strong>{field.label}</strong>
                                <span>{field.required ? 'Required' : 'Optional'}</span>
                              </div>
                            );
                          })
                      ) : (
                        <p>All fields are filled in.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="assessment-group">
                  <div className="assessment-group__heading">
                    <h3>{currentStep?.title}</h3>
                    <p>{currentStep?.description}</p>
                  </div>

                  <div className="assessment-grid">
                    {currentFields.map((field) => (
                      <FormField
                        key={field.name}
                        field={field}
                        value={values[field.name]}
                        error={errors[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <PrimaryButton type="button" variant="ghost" onClick={onCancel}>
                  Back to Home
                </PrimaryButton>
                {canGoPrevious ? (
                  <PrimaryButton type="button" variant="ghost" onClick={goPrevious}>
                    Previous
                  </PrimaryButton>
                ) : null}
                {canGoNext ? (
                  <PrimaryButton type="button" onClick={goNext}>
                    Next
                  </PrimaryButton>
                ) : (
                  <PrimaryButton type="submit" disabled={loading}>
                    {loading ? 'Checking...' : 'Run CAD Assessment'}
                  </PrimaryButton>
                )}
              </div>
            </form>
          </SectionCard>
        </div>

        {renderStepSummary()}
      </div>

      <Disclaimer compact />
    </div>
  );
}
