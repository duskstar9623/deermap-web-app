import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { FeaturesSection } from './components/FeaturesSection';

function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
    </div>
  );
}

export default HomePage;
