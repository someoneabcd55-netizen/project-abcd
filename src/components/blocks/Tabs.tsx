'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabItem {
  label: string;
  icon?: string;
  childBlocks: any[];
}

interface TabsProps {
  tabStyle?: 'underline' | 'pill' | 'boxed';
  alignment?: 'left' | 'center' | 'right';
  tabs: TabItem[];
  Renderer: React.ComponentType<{ blocks: any[], theme?: string }>;
  theme?: string;
}

export function Tabs({
  tabStyle = 'underline',
  alignment = 'center',
  tabs = [],
  Renderer,
  theme,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const alignClass = { left: 'justify-start', center: 'justify-center', right: 'justify-end' }[alignment];

  return (
    <section className="py-12 px-6 w-full">
      <div className={cn("flex flex-wrap gap-2 mb-12", alignClass)}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={cn(
              "px-6 py-2 font-bold transition-all relative",
              tabStyle === 'underline' && (activeTab === i ? "text-accent-color" : "text-muted-foreground"),
              tabStyle === 'pill' && (activeTab === i ? "bg-accent-color text-white rounded-full" : "bg-white/5 rounded-full"),
              tabStyle === 'boxed' && (activeTab === i ? "bg-white border border-b-0 -mb-px z-10" : "bg-muted border border-transparent")
            )}
          >
            {tab.label}
            {tabStyle === 'underline' && activeTab === i && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-accent-color" />
            )}
          </button>
        ))}
      </div>
      
      <div className="w-full text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Renderer blocks={tabs[activeTab]?.childBlocks || []} theme={theme} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

