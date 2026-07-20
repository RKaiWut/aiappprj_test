import PrimaryButton from '../components/PrimaryButton';
import Disclaimer from '../components/Disclaimer';
import SectionCard from '../components/SectionCard';

export default function HomePage({ onStartAssessment }) {
  return (
    <div className="page-stack">
      <SectionCard
        title="Cardiovascular risk screening for a waiting-room workflow"
        description="A minimal prototype for estimating CAD risk from standard clinical features while keeping the assessment process fast and easy to read."
      >
        <div className="hero-copy">
          <p>
            This prototype is designed for Singaporean users who want a quick assessment while waiting for a longer checkup. The current build focuses on clean data entry, predictable API flow, and a foundation that can later support chatbot guidance.
          </p>
          <div className="hero-actions">
            <PrimaryButton onClick={onStartAssessment}>Start Assessment</PrimaryButton>
          </div>
        </div>
      </SectionCard>

      <Disclaimer />
    </div>
  );
}
