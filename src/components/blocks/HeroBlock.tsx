'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroButton {
  label: string;
  link: string;
  style: 'solid' | 'outlined' | 'ghost';
}

interface FloatingCard {
  title: string;
  body: string;
  badges?: string[];
}

interface HeroBlockProps {
  eyebrowLabel?: string;
  title: string;
  titleAccentWords?: string[];
  subtitle?: string;
  backgroundType: 'image' | 'gradient' | 'solid' | 'video';
  backgroundValue: string;
  overlayOpacity?: number;
  layout: 'centered' | 'split-left' | 'split-right';
  buttons?: HeroButton[];
  floatingCard?: FloatingCard;
  animation?: 'none' | 'fadeInUp' | 'fadeInLeft' | 'zoomIn';
  minHeight?: 'auto' | '50vh' | '75vh' | '100vh';
  theme?: string;
}

export function HeroBlock({
  eyebrowLabel,
  title,
  titleAccentWords = [],
  subtitle,
  backgroundType,
  backgroundValue,
  overlayOpacity = 50,
  layout = 'centered',
  buttons = [],
  floatingCard,
  animation = 'fadeInUp',
  minHeight = '75vh',
  theme,
}: HeroBlockProps) {
  
  const renderTitle = () => {
    if (!titleAccentWords.length) return title;
    
    let parts = (title || '').split(' ');
    return parts.map((word, i) => {
      const isAccent = titleAccentWords.some(a => word.toLowerCase().includes(a.toLowerCase()));
      return (
        <span key={i} className={cn(isAccent && "text-accent-color")}>
          {word}{' '}
        </span>
      );
    });
  };

  const getAnimationProps = (index: number) => {
    if (animation === 'none') return {};
    
    const variants = {
      fadeInUp: { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
      fadeInLeft: { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
      zoomIn: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
    };
    
    const active = variants[animation as keyof typeof variants] || variants.fadeInUp;
    
    return {
      initial: active.initial,
      whileInView: active.animate,
      viewport: { once: true },
      transition: { duration: 0.6, delay: index * 0.15 },
    };
  };

  return (
    <section 
      className={cn(
        "relative flex items-center overflow-hidden w-full",
        minHeight === 'auto' ? "min-h-[400px]" : `min-h-[${minHeight}]`
      )}
      style={{ minHeight: minHeight !== 'auto' ? minHeight : undefined }}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {backgroundType === 'solid' && (
          <div className="w-full h-full" style={{ backgroundColor: backgroundValue }} />
        )}
        {backgroundType === 'gradient' && (
          <div className="w-full h-full" style={{ background: backgroundValue }} />
        )}
        {backgroundType === 'image' && (
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${backgroundValue})` }} 
          />
        )}
        {backgroundType === 'video' && (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src={backgroundValue} type="video/mp4" />
          </video>
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black" 
          style={{ opacity: (overlayOpacity || 50) / 100 }} 
        />
      </div>

      {/* Content Container */}
      <div className={cn(
        "container mx-auto px-6 relative z-10 py-20",
        layout === 'centered' ? "text-center" : "flex flex-col lg:flex-row items-center gap-12"
      )}>
        
        <div className={cn(
          "max-w-3xl",
          layout === 'centered' ? "mx-auto" : (layout === 'split-right' ? "lg:order-2" : ""),
        )}>
          {eyebrowLabel && (
            <motion.p 
              {...getAnimationProps(0)}
              className="text-accent-color uppercase tracking-widest font-bold text-sm mb-4"
            >
              {eyebrowLabel}
            </motion.p>
          )}
          
          <motion.h1 
            {...getAnimationProps(1)}
            className="text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold text-white leading-tight mb-6"
          >
            {renderTitle()}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              {...getAnimationProps(2)}
              className="text-lg md:text-xl text-white/80 font-body mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div 
            {...getAnimationProps(3)}
            className={cn(
              "flex flex-wrap gap-4",
              layout === 'centered' ? "justify-center" : ""
            )}
          >
            {(buttons || []).map((btn, i) => (
              <Button 
                key={i} 
                asChild
                variant={btn.style === 'outlined' ? 'outline' : (btn.style === 'ghost' ? 'ghost' : 'default')}
                className={cn(
                  "px-8 py-6 text-lg rounded-full font-bold transition-all hover:scale-105",
                  btn.style === 'solid' ? "bg-accent-color hover:bg-accent-color/90 text-white border-none" : "text-white border-white hover:bg-white hover:text-black"
                )}
              >
                <Link href={btn.link}>{btn.label}</Link>
              </Button>
            ))}
          </motion.div>
        </div>

        {/* Floating Card (for split layouts) */}
        {layout !== 'centered' && floatingCard && (
          <motion.div 
            {...getAnimationProps(4)}
            className={cn(
              "flex-grow max-w-md w-full",
              layout === 'split-right' ? "lg:order-1" : ""
            )}
          >
            <div className="glass-morphism p-8 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-md bg-white/10 text-white">
              <h3 className="text-2xl font-bold mb-4">{floatingCard.title}</h3>
              <p className="text-white/70 mb-6">{floatingCard.body}</p>
              {floatingCard.badges && (
                <div className="flex flex-wrap gap-2">
                  {floatingCard.badges.map((badge, i) => (
                    <span key={i} className="px-3 py-1 bg-accent-color/20 border border-accent-color/40 rounded-full text-xs text-accent-color font-bold uppercase">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
    </section>
  );
}

