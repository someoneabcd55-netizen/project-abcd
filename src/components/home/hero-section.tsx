import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface HeroProps { 
    imageurl?: string; 
    title?: string; 
    subtitle?: string; 
    primaryCtaLabel?: string;
    primaryCtaUrl?: string;
    secondaryCtaLabel?: string;
    secondaryCtaUrl?: string;
}

export function HeroSection({ imageurl, title, subtitle, primaryCtaLabel, primaryCtaUrl, secondaryCtaLabel, secondaryCtaUrl }: HeroProps) {
  return (
    <section className="relative h-[60vh] w-full">
      <div className="absolute inset-0">
        {imageurl && <Image src={imageurl} alt={title || 'hero'} fill className="object-cover" priority />}
        <div className="absolute inset-0 bg-primary/70" />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground px-4">
        {title && <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>}
        {subtitle && <p className="mt-4 max-w-2xl text-lg md:text-xl">{subtitle}</p>}
        <div className="mt-8 flex gap-4">
          {primaryCtaLabel && primaryCtaUrl && (
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href={primaryCtaUrl}>{primaryCtaLabel}</Link>
            </Button>
          )}
          {secondaryCtaLabel && secondaryCtaUrl && (
             <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href={secondaryCtaUrl}>{secondaryCtaLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
