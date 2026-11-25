import Features from "../components/Features/Features";
import SubPageLayout from "../components/SubPageLayout";

function FeaturesPage({ onLaunchApp, onGoHome }) {
  return (
    <SubPageLayout
      kicker="Ethical AI Capabilities // 06 Core Vectors"
      title="Automated Ethical & Cyber Risk Detection"
      subtitle="Deterministic neural heuristics, threat telemetry, and compliance scanners evaluating AI model endpoints and web platforms in real time."
      onLaunchApp={onLaunchApp}
      onGoHome={onGoHome}
      ctaTitle="Ready to Run a Full Feature Audit?"
      ctaDescription="Inspect SSL certificates, privacy policies, phishing vectors, and security headers instantly with our zero-setup engine."
      ctaButtonText="Run Ethical Scan"
    >
      <Features />
    </SubPageLayout>
  );
}

export default FeaturesPage;
