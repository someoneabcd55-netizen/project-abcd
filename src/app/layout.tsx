import type { Metadata } from 'next';
import { Inter, Playfair_Display, DM_Sans, Bebas_Neue, Manrope } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getPagesPublic } from '@/firebase/services/pages';
import { getFooterContent } from '@/firebase/services/footer';
import { getAppearanceSettings } from '@/firebase/services/settings';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas-neue', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'Modern School',
  description: 'Your gateway to higher education.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pages, footerContent, appearance] = await Promise.all([
    getPagesPublic(),
    getFooterContent(),
    getAppearanceSettings(),
  ]);

  const themeClass = appearance?.theme || 'theme3';

  return (
    <html lang="en" className={cn(inter.variable, playfair.variable, dmSans.variable, bebasNeue.variable, manrope.variable)} suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          playfair.variable,
          dmSans.variable,
          bebasNeue.variable,
          manrope.variable,
          themeClass
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header pages={pages} theme={themeClass} />
          <main className="flex-1">{children}</main>
          <Footer content={footerContent} theme={themeClass} />
        </div>
        <Toaster />
      </body>
    </html>
  );
}

