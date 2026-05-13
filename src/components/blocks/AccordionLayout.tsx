'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface AccordionLayoutItem {
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  childBlocks: any[];
}

interface AccordionLayoutProps {
  style?: 'bordered' | 'minimal' | 'filled';
  allowMultipleOpen?: boolean;
  items: AccordionLayoutItem[];
  Renderer: React.ComponentType<{ blocks: any[], theme?: string }>;
  theme?: string;
}

export function AccordionLayout({
  style = 'bordered',
  allowMultipleOpen = false,
  items = [],
  Renderer,
  theme,
}: AccordionLayoutProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>(items.map((it, idx) => it.defaultOpen ? idx : -1).filter(i => i >= 0));

  const toggle = (idx: number) => {
    if (allowMultipleOpen) {
      setOpenIndexes(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    } else {
      setOpenIndexes(prev => prev.includes(idx) ? [] : [idx]);
    }
  };

  return (
    <section className="py-12 px-6 w-full max-w-5xl mx-auto">
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className={cn(
            "overflow-hidden",
            style === 'bordered' && "border border-border rounded-2xl",
            style === 'minimal' && "border-b border-border rounded-none",
            style === 'filled' && "bg-white/5 rounded-2xl"
          )}>
            <button 
              onClick={() => toggle(i)}
              className="w-full p-6 text-left flex justify-between items-center group transition-all"
            >
              <span className="font-bold text-lg">{item.title}</span>
              <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", openIndexes.includes(i) && "rotate-90")} />
            </button>
            <AnimatePresence>
              {openIndexes.includes(i) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="p-6 pt-0 text-left">
                    <Renderer blocks={item.childBlocks} theme={theme} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

