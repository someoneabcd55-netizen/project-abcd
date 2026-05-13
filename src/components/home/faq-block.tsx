'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQBlockProps {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
  theme?: string;
}

export function FAQBlock({ title, subtitle, items, theme }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const defaultItems: FAQItem[] = [
    { question: 'What are the admission requirements?', answer: 'Admission requirements vary by program. Generally, we require official transcripts, a statement of purpose, and relevant test scores.' },
    { question: 'Are there scholarship opportunities available?', answer: 'Yes, we offer a wide range of merit-based and need-based scholarships for both domestic and international students.' },
    { question: 'What is the student-to-faculty ratio?', answer: 'Our student-to-faculty ratio is 15:1, ensuring personalized attention and a supportive learning environment.' },
    { question: 'Do you offer online or hybrid courses?', answer: 'Yes, many of our programs offer flexible learning options including online, hybrid, and evening classes.' },
  ];

  const displayItems = items || defaultItems;

  return (
    <section className={cn(
      "py-20 md:py-32",
      isTheme2 ? "bg-[#0a0f1e]" : isTheme3 ? "bg-[#f4f6f9]" : "bg-background"
    )}>
      <div className="container mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-12 items-start">
          {/* Header Area */}
          <div className="lg:col-span-5 space-y-6">
            {isTheme3 && <span className="text-[#cc2936] text-[10px] font-bold uppercase tracking-[0.4em] block">Support Directory</span>}
            <h2 className={cn(
              "text-4xl md:text-6xl font-bold tracking-tight leading-tight",
              isTheme2 ? "text-white font-headline" : isTheme3 ? "text-navy font-headline uppercase" : "font-headline"
            )}>
              {title || 'Frequently Asked Questions'}
            </h2>
            <p className={cn(
              "text-lg",
              isTheme2 ? "text-gray-400 font-body" : isTheme3 ? "text-navy/60 font-body" : "text-muted-foreground"
            )}>
              {subtitle || 'Everything you need to know about our academic programs and campus life. If you can\'t find the answer here, feel free to contact us.'}
            </p>
            
            {isTheme2 && (
              <div className="pt-8 flex items-center gap-4 text-indigo-400">
                <HelpCircle className="h-12 w-12 animate-pulse" />
                <span className="font-headline text-2xl uppercase">Help Center</span>
              </div>
            )}
          </div>

          {/* Accordion Area */}
          <div className="lg:col-span-7 space-y-4">
            {displayItems.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div 
                  key={i}
                  className={cn(
                    "overflow-hidden transition-all duration-500",
                    isTheme2 
                      ? "bg-white/5 border border-white/10 rounded-2xl" 
                      : isTheme3
                        ? "bg-white border-b border-gray-100 rounded-none"
                        : "bg-card border rounded-xl"
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
                  >
                    <span className={cn(
                      "text-xl font-bold transition-colors",
                      isTheme2 ? (isOpen ? "text-indigo-400" : "text-white group-hover:text-indigo-300") : 
                      isTheme3 ? "text-navy uppercase font-headline tracking-wide" : 
                      (isOpen ? "text-primary" : "text-card-foreground")
                    )}>
                      {item.question}
                    </span>
                    <div className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-full transition-all duration-500",
                      isTheme2 ? "bg-indigo-500/10 text-indigo-400" : 
                      isTheme3 ? (isOpen ? "bg-[#cc2936] text-white" : "bg-gray-100 text-navy") :
                      "bg-primary/10 text-primary"
                    )}>
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>
                  
                  <div className={cn(
                    "transition-all duration-500 ease-in-out overflow-hidden",
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className={cn(
                      "px-6 md:px-8 pb-8",
                      isTheme2 ? "text-gray-400 font-body" : isTheme3 ? "text-gray-500 font-body font-medium" : "text-muted-foreground"
                    )}>
                      <p className="leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
