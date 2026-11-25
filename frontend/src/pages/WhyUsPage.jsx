import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import SubPageLayout from "../components/SubPageLayout";

function WhyUsPage({ onLaunchApp, onGoHome }) {
  return (
    <SubPageLayout
      kicker="Governance & Trust // NIST AI RMF & EU AI Act"
      title="Why Organizations Trust Our Ethical AI Scanner"
      subtitle="Unlike opaque proprietary black boxes, our evaluation pipeline operates on explainable indicators, strict zero-retention policies, and empirical threat intelligence."
      onLaunchApp={onLaunchApp}
      onGoHome={onGoHome}
      ctaTitle="Benchmark Your AI Footprint"
      ctaDescription="Compare your systems against global threat databases and ethical governance standards in seconds."
      ctaButtonText="Benchmark URL"
    >
      <WhyChooseUs />
    </SubPageLayout>
  );
}

export default WhyUsPage;
