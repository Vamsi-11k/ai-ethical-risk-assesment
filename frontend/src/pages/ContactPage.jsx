import Contact from "../components/Contact/Contact";
import SubPageLayout from "../components/SubPageLayout";

function ContactPage({ onLaunchApp, onGoHome }) {
  return (
    <SubPageLayout
      kicker="Research & Enterprise Inquiries"
      title="Connect With Our AI Safety & Governance Team"
      subtitle="Need custom enterprise compliance telemetry, continuous model auditing, or academic research collaboration? We are here to support your mission."
      onLaunchApp={onLaunchApp}
      onGoHome={onGoHome}
    >
      <Contact />
    </SubPageLayout>
  );
}

export default ContactPage;
