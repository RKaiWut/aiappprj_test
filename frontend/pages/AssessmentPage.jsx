import PrimaryButton from '../components/PrimaryButton';
import Disclaimer from '../components/Disclaimer';
import FormField from '../components/FormField';
import SectionCard from '../components/SectionCard';
import { assessmentFieldGroups } from '../utils/assessmentConfig';
import { buildAssessmentPayload } from '../utils/payload';
import { useAssessmentForm } from '../hooks/useAssessmentForm';

export default function AssessmentPage({ onSubmitAssessment, loading, onCancel }) {
  const { values, errors, handleChange, handleBlur, validateAll, getFieldMeta } = useAssessmentForm();

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
      <SectionCard
        title="Assessment form"
        description="Enter the 13 model features only. The form keeps the data aligned with the trained CAD pipeline."
      >
        <form className="assessment-form" onSubmit={handleSubmit} noValidate>
          {assessmentFieldGroups.map((group) => (
            <div key={group.id} className="assessment-group">
              <div className="assessment-group__heading">
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
              <div className="assessment-grid">
                {group.fields.map((fieldName) => {
                  const field = getFieldMeta(fieldName);
                  return (
                    <FormField
                      key={field.name}
                      field={field}
                      value={values[field.name]}
                      error={errors[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          <div className="form-actions">
            <PrimaryButton type="button" variant="ghost" onClick={onCancel}>
              Back to Home
            </PrimaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Run CAD Assessment'}
            </PrimaryButton>
          </div>
        </form>
      </SectionCard>

      <Disclaimer compact />
    </div>
  );
}
