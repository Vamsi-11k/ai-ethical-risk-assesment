import About from "../components/About/About";
import SubPageLayout from "../components/SubPageLayout";

function ManifestoPage({ onLaunchApp, onGoHome }) {
  return (
    <SubPageLayout
      kicker="Our Ethical Commitment // Manifesto"
      title="The EthicalAI Governance Manifesto"
      subtitle="We believe artificial intelligence must be accountable, human-dignified, and auditable by design. Learn the principles that drive our research and algorithms."
      onLaunchApp={onLaunchApp}
      onGoHome={onGoHome}
      ctaTitle="Put Principles into Action"
      ctaDescription="Join developers and safety researchers verifying compliance before deployment."
      ctaButtonText="Run Studio Scan"
    >
      <About />
    </SubPageLayout>
  );
}

export default ManifestoPage;
