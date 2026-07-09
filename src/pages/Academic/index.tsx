import { AcademicHeroSection } from './components/AcademicHeroSection';
import { AcademicServicesSection } from './components/AcademicServicesSection';

function AcademicPage() {
  return (
    <div className="min-h-screen pt-20">
      <AcademicHeroSection />
      <AcademicServicesSection />
    </div>
  );
}

export default AcademicPage;
