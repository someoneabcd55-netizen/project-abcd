'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Menu,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { Page } from '@/firebase/services/pages';

interface HeaderProps {
  pages: Page[];
  theme?: string;
}

export function Header({ pages, theme }: HeaderProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const navLinks = pages.map(p => ({
    href: p.slug === 'home' ? '/' : `/${p.slug}`,
    label: p.title,
  }));



  if (!mounted) {
    return <header className="h-20 bg-background border-b w-full" />;
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full",
      isTheme2 
        ? "bg-white/5 backdrop-blur-md border-b border-[var(--border)] h-20 flex items-center" 
        : isTheme3
          ? "bg-white border-b border-gray-200 h-20 flex items-center"
          : "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex items-center justify-between w-full">
          <div className="flex items-center gap-12">
            <Link href="/" className="mr-6 flex items-center space-x-2">
               <div className={cn(
                  "flex items-center justify-center rounded-full transition-all",
                  isTheme3 ? "h-10 w-10 bg-[#0d1b3e] text-white" : ""
               )}>
                  <GraduationCap className={cn("h-6 w-6 text-primary", (isTheme2 || isTheme3) && "text-white")} />
               </div>
                <span className={cn(
                  "hidden font-bold sm:inline-block font-headline",
                  isTheme2 ? "text-2xl text-white tracking-tight" : 
                  isTheme3 ? "text-2xl text-[#0d1b3e] tracking-tight uppercase" : ""
                )}>
                Modern School
              </span>
            </Link>
            <nav className="flex items-center space-x-8 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'transition-all duration-200 relative group',
                    isTheme2 ? 'text-[var(--text-secondary)] hover:text-[var(--accent)] font-body' : 
                    isTheme3 ? 'text-[#0d1b3e] hover:text-[#cc2936] font-body uppercase tracking-wider text-xs font-bold' :
                    'hover:text-primary',
                    pathname === link.href ? 'text-primary' : (isTheme2 ? 'text-[var(--text-secondary)]' : (isTheme3 ? 'text-[#0d1b3e]' : 'text-foreground/60'))
                  )}
                >
                  {link.label}
                  {(isTheme2 || isTheme3) && (
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                      isTheme2 ? "bg-[var(--accent)]" : "bg-[#cc2936]",
                      pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          {(isTheme2 || isTheme3) && (
            <div className="flex items-center gap-4">
              <Button variant="outline" className={cn(
                "rounded-full px-6",
                isTheme2 ? "border-white text-white hover:bg-white hover:text-[#0a0f1e]" :
                isTheme3 ? "border-[#0d1b3e] text-[#0d1b3e] hover:bg-[#0d1b3e] hover:text-white uppercase text-xs font-bold" : ""
              )}>
                {isTheme3 ? "Join" : "Login"}
              </Button>
              <Button className={cn(
                "rounded-full px-8 border-none",
                isTheme2 ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 shadow-[0_0_15px_rgba(99,102,241,0.4)]" :
                isTheme3 ? "bg-[#0d1b3e] text-white hover:bg-[#162347] uppercase text-xs font-bold" : ""
              )}>
                 {isTheme3 ? (
                   <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Portal
                   </span>
                 ) : "Apply Now"}
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                <Menu className={cn("h-6 w-6", isTheme2 && "text-white")} />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className={cn("pr-0", isTheme2 && "bg-[#0a0f1e] text-white border-white/10")}>
              <Link
                href="/"
                className="mb-6 flex items-center"
              >
                <GraduationCap className="mr-2 h-6 w-6 text-primary" />
                <span className="font-bold text-lg font-headline">Modern School</span>
              </Link>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'transition-all duration-200 relative group',
                      isTheme2 ? 'text-[var(--text-secondary)] hover:text-[var(--accent)] font-body' : 
                      isTheme3 ? 'text-[#0d1b3e] hover:text-[#cc2936] font-body uppercase tracking-wider text-xs font-bold' :
                      'hover:text-primary',
                      pathname === link.href ? 'text-primary font-semibold' : 'text-foreground/80'
                    )}
                  >
                    {link.label}
                    {(isTheme2 || isTheme3) && (
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                        isTheme2 ? "bg-[var(--accent)]" : "bg-[#cc2936]",
                        pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    )}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
           <div className="md:hidden flex items-center">
             <Link href="/" className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold sm:inline-block font-headline">
                  Modern School
                </span>
              </Link>
           </div>
        </div>
      </div>
    </header>
  );
}
