'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  eyebrowLabel?: string;
  title: string;
  subtitle?: string;
  style?: 'accordion' | 'grid';
  items: FAQItem[];
  allowMultipleOpen?: boolean;
  defaultOpenIndex?: number;
}

export function FAQBlock({
  eyebrowLabel,
  title,
  subtitle,
  style = 'accordion',
  items = [],
  allowMultipleOpen = false,
  defaultOpenIndex = -1,
}: FAQProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>(defaultOpenIndex >= 0 ? [defaultOpenIndex] : []);

  const toggleIndex = (index: number) => {
    if (allowMultipleOpen) {
      setOpenIndexes(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    } else {
      setOpenIndexes(prev => prev.includes(index) ? [] : [index]);
    }
  };

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        {eyebrowLabel && <p className="text-accent-color uppercase tracking-widest text-sm font-bold mb-2">{eyebrowLabel}</p>}
        <h2 className="text-4xl font-headline font-bold mb-4">{title}</h2>
        {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
      </div>

      {style === 'accordion' ? (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
              <button 
                onClick={() => toggleIndex(i)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-lg">{item.question}</span>
                <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", openIndexes.includes(i) && "rotate-180")} />
              </button>
              <AnimatePresence>
                {openIndexes.includes(i) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-muted-foreground border-t border-border/50 mt-2">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-border/30">
              <h4 className="font-bold text-lg mb-3 flex gap-3">
                <span className="text-accent-color font-extrabold">Q.</span>
                {item.question}
              </h4>
              <p className="text-muted-foreground pl-7">{item.answer}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

