import { GraduationCap, Facebook, Twitter, Linkedin, Instagram, Youtube, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { FooterContent } from '@/firebase/services/footer';
import { cn } from '@/lib/utils';

const iconMap: { [key: string]: LucideIcon } = {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
};

interface FooterProps {
  content: FooterContent | null;
  theme?: string;
}

export function Footer({ content, theme }: FooterProps) {
  if (!content) return null;
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  return (
    <footer className={cn(
      "border-t",
      isTheme2 ? "bg-[var(--surface)] border-[var(--border)] text-white py-12" : 
      isTheme3 ? "bg-[#0d1b3e] text-white py-16" :
      "bg-secondary/50"
    )}>
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-5">
          <div className="flex flex-col space-y-6 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className={cn("h-8 w-8 text-primary", (isTheme2 || isTheme3) && "text-white")} />
              <span className={cn("text-xl font-bold font-headline", (isTheme2 || isTheme3) && "text-2xl tracking-tight uppercase")}>Modern School</span>
            </Link>
             <p className={cn("text-sm text-muted-foreground", (isTheme2 || isTheme3) && "text-gray-400 font-body")}>
                Excellence in Education, Innovation in Research.
             </p>
             {(isTheme2 || isTheme3) && (
                <div className="flex space-x-3 pt-2">
                   {content.socialLinks?.map((social, index) => {
                      const Icon = social.platform ? iconMap[social.platform] : null;
                      return (
                        <Link key={index} href={social.url} className={cn(
                          "w-10 h-10 border flex items-center justify-center transition-all",
                          isTheme2 ? "border-[var(--border)] rounded-md hover:border-[var(--accent)] hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]" :
                          isTheme3 ? "border-white/20 rounded-none hover:border-[#cc2936] hover:shadow-[0_0_15px_rgba(204,41,54,0.4)]" : ""
                        )}>
                            {Icon && <Icon className={cn("h-5 w-5", isTheme2 ? "text-[var(--text-secondary)] hover:text-white" : isTheme3 ? "text-gray-400 hover:text-white" : "")} />}
                        </Link>
                      );
                   })}
                </div>
             )}
          </div>

          {content.linkColumns?.map((column, index) => (
             <div key={index}>
              <h3 className={cn(
                "mb-6 font-headline font-semibold", 
                isTheme2 ? "text-white uppercase tracking-widest text-xs" :
                isTheme3 ? "text-[#cc2936] uppercase tracking-[0.2em] text-xs font-bold" : ""
              )}>
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links?.map((link, linkIndex) => (
                    <li key={linkIndex}>
                        <Link href={link.url} className={cn(
                          "text-sm transition-colors",
                          isTheme2 ? "text-[var(--text-secondary)] hover:text-white" :
                          isTheme3 ? "text-gray-400 hover:text-white font-body" :
                          "text-muted-foreground hover:text-primary"
                        )}>
                          {link.label}
                        </Link>
                    </li>
                ))}
              </ul>
            </div>
          ))}
          
          {!isTheme2 && !isTheme3 && content.socialLinks && content.socialLinks.length > 0 && (
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
        <div className={cn(
          "mt-12 border-t pt-8 text-sm",
          isTheme2 ? "border-[var(--border)] text-[var(--text-muted)] text-center" :
          isTheme3 ? "border-white/10 text-gray-500 text-center font-body" :
          "text-muted-foreground text-center"
        )}>
          <p>&copy; {new Date().getFullYear()} Modern School. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
