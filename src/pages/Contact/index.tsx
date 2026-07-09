import { ContactHeroSection } from './components/ContactHeroSection';
import { ContactInfoSection } from './components/ContactInfoSection';
import { ContactFormSection } from './components/ContactFormSection';

function ContactPage() {
  return (
    <div className="min-h-screen pt-20">
      <ContactHeroSection />
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactInfoSection />
            <ContactFormSection />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
