'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';

export function AnnouncementsBlock({ 
  title = 'Announcements & News', 
  announcements = [], 
  theme 
}: any) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';
  
  return (
    <section className={cn(
      "container mx-auto px-4 py-12 md:px-6 lg:py-16",
      (isTheme2 || isTheme3) && "max-w-7xl"
    )}>
      <div className="flex flex-col items-center mb-12 text-center">
          <h2 className={cn(
            "font-headline text-3xl font-bold md:text-4xl", 
            isTheme2 ? "text-white" : isTheme3 ? "text-navy uppercase tracking-tight" : "text-foreground"
          )}>
              {title}
          </h2>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {announcements.length === 0 ? (
          <p className="text-center col-span-3 text-muted-foreground">No announcements to display.</p>
        ) : (
          announcements.map((item: any, index: number) => (
            <Card key={index} className={cn(
              "flex flex-col group transition-all duration-300",
              isTheme2 ? "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-accent)] hover:-translate-y-2 shadow-xl" : 
              isTheme3 ? "bg-white border-gray-200 hover:border-navy hover:-translate-y-1 shadow-sm hover:shadow-md rounded-none" : ""
            )}>
                <CardHeader className={cn(isTheme3 && "pb-4")}>
                  <div className="flex justify-between items-center mb-4">
                      <Newspaper className="h-6 w-6 text-primary" />
                      {item.date && (
                        <CardDescription className="text-xs">
                          {format(new Date(item.date), 'PPP')}
                        </CardDescription>
                      )}
                  </div>
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {item.description}
                    </p>
                    <div className="pt-2">
                      <Link href={`/announcements/${item.id || '#'}`} className="inline-flex items-center font-bold text-sm text-primary hover:underline">
                          Read more 
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
