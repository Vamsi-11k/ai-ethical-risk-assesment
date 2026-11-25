import RiskCategories from "../components/RiskCategories/RiskCategories";
import SubPageLayout from "../components/SubPageLayout";

function CategoriesPage({ onLaunchApp, onGoHome }) {
  return (
    <SubPageLayout
      kicker="Scoring Taxonomy // 05 Risk Domains"
      title="Five Ethical Risk Domains & Thresholds"
      subtitle="Every audit aggregates data privacy, transparency, algorithmic bias, manipulation mechanisms, and authenticity into a weighted, normalized 0–100 index."
      onLaunchApp={onLaunchApp}
      onGoHome={onGoHome}
      ctaTitle="Explore How Your Site Scores"
      ctaDescription="Receive an itemized breakdown of scores across all five ethical categories with immediate remedial guidance."
      ctaButtonText="Calculate Score"
    >
      <RiskCategories />
    </SubPageLayout>
  );
}

export default CategoriesPage;
