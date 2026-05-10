import { GraduationCap, Facebook, Twitter, Linkedin, Instagram, Youtube, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { FooterContent } from '@/firebase/services/footer';

const iconMap: { [key: string]: LucideIcon } = {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
};

interface FooterProps {
  content: FooterContent | null;
}

export function Footer({ content }: FooterProps) {
  if (!content) return null;

  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
          <div className="flex flex-col space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">G V Hallikeri PU college</span>
            </Link>
             <p className="text-sm text-muted-foreground">
                Excellence in Education, Innovation in Research.
             </p>
          </div>

          {content.linkColumns?.map((column, index) => (
             <div key={index}>
              <h3 className="mb-4 font-headline font-semibold">{column.title}</h3>
              <ul className="space-y-2">
                {column.links?.map((link, linkIndex) => (
                    <li key={linkIndex}>
                        <Link href={link.url} className="text-sm text-muted-foreground hover:text-primary">{link.label}</Link>
                    </li>
                ))}
              </ul>
            </div>
          ))}
          
          {content.socialLinks && content.socialLinks.length > 0 && (
            <div>
                <h3 className="mb-4 font-headline font-semibold">Connect With Us</h3>
                <div className="flex space-x-4">
                {content.socialLinks?.map((social, index) => {
                    const Icon = social.platform ? iconMap[social.platform] : null;
                    return (
                    <Link key={index} href={social.url} aria-label={social.platform}>
                        {Icon && <Icon className="h-6 w-6 text-muted-foreground hover:text-primary" />}
                        </Link>
                    );
                })}
                </div>
            </div>
          )}
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>{content.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
