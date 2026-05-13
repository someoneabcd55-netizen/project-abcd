'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ImageLayoutProps {
  title?: string;
  subtitle?: string;
  layout: 'mosaic' | 'bento' | 'overlap' | 'stack';
  items: Array<{
    imageUrl: string;
    title?: string;
    description?: string;
  }>;
}

export function ImageLayout({ title, subtitle, layout = 'mosaic', items = [] }: ImageLayoutProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20 px-6 overflow-hidden">
      <div className="container mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16 space-y-4">
            {title && <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">{title}</h2>}
            {subtitle && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}

        <div className="w-full">
          {layout === 'mosaic' && <MosaicLayout items={items} />}
          {layout === 'bento' && <BentoLayout items={items} />}
          {layout === 'overlap' && <OverlapLayout items={items} />}
          {layout === 'stack' && <StackLayout items={items} />}
        </div>
      </div>
    </section>
  );
}

function MosaicLayout({ items }: { items: any[] }) {
  const getImg = (idx: number) => items[idx]?.imageUrl || 'https://picsum.photos/seed/placeholder/800/800';

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[600px] md:h-[800px]">
      <div className="md:col-span-8 h-full relative group overflow-hidden rounded-[2.5rem] bg-muted">
        {items[0]?.imageUrl && (
          <Image src={items[0].imageUrl} alt="" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
        )}
        {items[0]?.title && <Overlay title={items[0].title} />}
      </div>
      <div className="md:col-span-4 flex flex-col gap-4 h-full">
        <div className="flex-1 relative group overflow-hidden rounded-[2.5rem] bg-muted">
          {items[1]?.imageUrl && (
            <Image src={items[1].imageUrl} alt="" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
          )}
          {items[1]?.title && <Overlay title={items[1].title} />}
        </div>
        <div className="flex-1 relative group overflow-hidden rounded-[2.5rem] bg-muted">
          {(items[2]?.imageUrl || items[0]?.imageUrl) && (
            <Image src={items[2]?.imageUrl || items[0]?.imageUrl} alt="" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
          )}
          {items[2]?.title && <Overlay title={items[2].title} />}
        </div>
      </div>
    </div>
  );
}

function BentoLayout({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
      {items.map((item, i) => (
        <div 
          key={i} 
          className={cn(
            "relative group overflow-hidden rounded-3xl bg-muted",
            i === 0 && "md:col-span-2 md:row-span-2",
            i === 1 && "md:col-span-2",
            i === 2 && "md:col-span-1",
            i === 3 && "md:col-span-1"
          )}
        >
          {item.imageUrl && (
            <Image src={item.imageUrl} alt="" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
          )}
          {item.title && <Overlay title={item.title} />}
        </div>
      ))}
    </div>
  );
}

function OverlapLayout({ items }: { items: any[] }) {
  return (
    <div className="relative h-[600px] md:h-[800px] flex items-center justify-center">
      <div className="relative w-full max-w-5xl h-full">
        <motion.div 
          whileHover={{ zIndex: 50, scale: 1.02 }}
          className="absolute top-0 left-0 w-3/5 h-3/5 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white z-10 bg-muted"
        >
          {items[0]?.imageUrl && <Image src={items[0].imageUrl} alt="" fill className="object-cover" />}
        </motion.div>
        <motion.div 
          whileHover={{ zIndex: 50, scale: 1.02 }}
          className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white z-20 bg-muted"
        >
          {(items[1]?.imageUrl || items[0]?.imageUrl) && <Image src={items[1]?.imageUrl || items[0]?.imageUrl} alt="" fill className="object-cover" />}
        </motion.div>
        <motion.div 
          whileHover={{ zIndex: 50, scale: 1.02 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/5 h-2/5 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white z-30 hidden md:block bg-muted"
        >
          {(items[2]?.imageUrl || items[0]?.imageUrl) && <Image src={items[2]?.imageUrl || items[0]?.imageUrl} alt="" fill className="object-cover" />}
        </motion.div>
      </div>
    </div>
  );
}

function StackLayout({ items }: { items: any[] }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-full max-w-lg aspect-[3/4]">
        {items.slice(0, 4).map((item, i) => (
          <motion.div
            key={i}
            initial={{ rotate: (i - 1.5) * 10, y: i * 10 }}
            whileHover={{ y: -50, rotate: 0, scale: 1.1, zIndex: 50 }}
            className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-muted"
            style={{ zIndex: items.length - i }}
          >
            {item.imageUrl && <Image src={item.imageUrl} alt="" fill className="object-cover" />}
            {item.title && <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white font-bold">{item.title}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Overlay({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
      <h4 className="text-white font-bold text-2xl translate-y-4 group-hover:translate-y-0 transition-transform">{title}</h4>
    </div>
  );
}
