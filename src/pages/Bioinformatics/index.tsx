import { ServicesHeroSection } from './components/ServicesHeroSection';
import { ServiceCardsSection } from './components/ServiceCardsSection';

function ServicesPage() {
  return (
    <div className="min-h-screen">
      <ServicesHeroSection />
      <ServiceCardsSection />
    </div>
  );
}

export default ServicesPage;
