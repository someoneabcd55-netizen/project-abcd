import { Metadata } from 'next';
import { ContactPageContent } from '@/components/contact/contact-page';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with G V Hallikeri PU College. Visit us, call us, or fill out our contact form.',
};

export default function ContactPage() {
  return <ContactPageContent />;
}
