import { Metadata } from 'next';
import { ContactPageContent } from '@/components/contact/contact-page';
import { PageHeader } from '@/components/layout/page-header';
import { getAppearanceSettings } from '@/firebase/services/settings';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Modern School. Visit us, call us, or fill out our contact form.',
};

export default async function ContactPage() {
  const appearance = await getAppearanceSettings();
  const theme = appearance?.theme;

  return (
    <div>
      <PageHeader 
        eyebrow="Get In Touch"
        title="Contact Us" 
        description="Have questions? We're here to help. Reach out to us through any of the channels below."
        theme={theme}
      />
      <ContactPageContent theme={theme} />
    </div>
  );
}

