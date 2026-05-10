import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SiteChatbot } from '@/components/chat/site-chatbot';
import { getPagesPublic } from '@/firebase/services/pages';
import { getFooterContent } from '@/firebase/services/footer';
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'G V Hallikeri PU college',
  description: 'Your gateway to higher education.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pages, footerContent] = await Promise.all([
    getPagesPublic(),
    getFooterContent(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          ptSans.className,
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header pages={pages} />
          <main className="flex-1">{children}</main>
          <Footer content={footerContent} />
          <SiteChatbot />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
