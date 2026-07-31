import { PricingHeroSection } from './components/PricingHeroSection';
import { PricingPlansSection } from './components/PricingPlansSection';

function PricingPage() {
  return (
    <div className="min-h-screen">
      <PricingHeroSection />
      <PricingPlansSection />
    </div>
  );
}

export default PricingPage;
