import HowItWorks from "../components/HowItWorks/HowItWorks";
import SubPageLayout from "../components/SubPageLayout";

function WorkflowPage({ onLaunchApp, onGoHome }) {
  return (
    <SubPageLayout
      kicker="Interactive Pipelines // Visual Architecture"
      title="How URL Auditing & Hallucination Detection Work"
      subtitle="Switch between the URL Ethical Risk Pipeline and the Zero-Cost Hallucination Engine to watch every verification stage animate step by step."
      onLaunchApp={onLaunchApp}
      onGoHome={onGoHome}
      ctaTitle="Try Both Engines Live in Audit Studio"
      ctaDescription="Scan any URL for ethical risk or paste AI-generated text to verify claims, citations, and contradictions."
      ctaButtonText="Open Audit Studio"
    >
      <HowItWorks />
    </SubPageLayout>
  );
}

export default WorkflowPage;
