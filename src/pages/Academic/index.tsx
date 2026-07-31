import { AcademicHeroSection } from './components/AcademicHeroSection';
import { AcademicServicesSection } from './components/AcademicServicesSection';

function AcademicPage() {
  return (
    <div className="min-h-screen">
      <AcademicHeroSection />
      <AcademicServicesSection />
    </div>
  );
}

export default AcademicPage;
