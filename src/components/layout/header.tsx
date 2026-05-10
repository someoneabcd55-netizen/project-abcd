'use client';

import {
  GraduationCap,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { Page } from '@/firebase/services/pages';

interface HeaderProps {
  pages: Page[];
}

export function Header({ pages }: HeaderProps) {
  const pathname = usePathname();

  const navLinks = pages.map(p => ({
    href: p.slug === 'home' ? '/' : `/${p.slug}`,
    label: p.title,
  }));

  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => {
    return navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          'transition-colors hover:text-primary',
           inSheet ?
           (pathname === link.href ? 'text-primary font-semibold' : 'text-foreground/80')
           : (pathname === link.href ? 'text-primary' : 'text-foreground/60')
        )}
      >
        {link.label}
      </Link>
    ));
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              G V Hallikeri PU college
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLinks />
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link
                href="/"
                className="mb-6 flex items-center"
              >
                <GraduationCap className="mr-2 h-6 w-6 text-primary" />
                <span className="font-bold text-lg font-headline">G V Hallikeri PU college</span>
              </Link>
              <div className="flex flex-col space-y-3">
                <NavLinks inSheet={true} />
              </div>
            </SheetContent>
          </Sheet>
           <div className="md:hidden flex items-center">
             <Link href="/" className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold sm:inline-block font-headline">
                  G V Hallikeri PU college
                </span>
              </Link>
           </div>
        </div>
      </div>
    </header>
  );
}
