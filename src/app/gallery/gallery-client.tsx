'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { GalleryImage } from '@/firebase/services/gallery';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function GalleryClient({ initialImages, theme }: { initialImages: GalleryImage[], theme?: string }) {
    const [images] = useState(initialImages);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const isTheme2 = theme === 'theme2';
    const isTheme3 = theme === 'theme3';

    const categories = useMemo(() => {
        const cats = new Set(['All']);
        images.forEach(img => {
            if (img.alt.includes('NCC')) cats.add('NCC');
            else if (img.alt.includes('NSS')) cats.add('NSS');
            else if (img.alt.includes('Sports')) cats.add('Sports');
            else cats.add('Campus');
        });
        return Array.from(cats);
    }, [images]);

    const filteredImages = useMemo(() => {
        return images.filter(img => {
            const matchesCategory = activeCategory === 'All' || img.alt.includes(activeCategory) || (activeCategory === 'Campus' && !img.alt.match(/NCC|NSS|Sports/));
            const matchesSearch = img.alt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch && img.src && img.src.startsWith('http');
        });
    }, [images, activeCategory, searchQuery]);

    return (
        <div className="space-y-12">
            {/* Filters and Search */}
            <div className={cn(
                "flex flex-col md:flex-row md:items-center justify-between gap-6",
                isTheme2 ? "p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl" : ""
            )}>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
                                isTheme2 
                                    ? (activeCategory === cat ? "bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]" : "bg-white/5 text-[var(--text-muted)] border border-white/10 hover:bg-white/10")
                                    : isTheme3
                                        ? (activeCategory === cat ? "bg-[#0d1b3e] text-white shadow-md" : "bg-transparent text-[#0d1b3e] border border-[#0d1b3e]/20 hover:bg-[#0d1b3e]/5")
                                        : (activeCategory === cat ? "bg-primary text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative max-w-sm w-full">
                    <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4", (isTheme2 || isTheme3) ? "text-gray-400" : "text-muted-foreground")} />
                    <Input 
                        placeholder="Search gallery..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                            "pl-11 rounded-full transition-all",
                            isTheme2 ? "bg-white/5 border-white/10 text-white placeholder:text-gray-700 focus:border-[var(--accent)]" : 
                            isTheme3 ? "bg-gray-50 border-gray-200 text-[#0d1b3e] placeholder:text-gray-400 focus:border-[#0d1b3e]" :
                            "bg-background"
                        )}
                    />
                </div>
            </div>

            {filteredImages.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground">
                    <p className="text-xl">No images found matching your criteria.</p>
                </div>
            ) : (
                <div className={cn(
                    "grid gap-6",
                    isTheme2 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : 
                    isTheme3 ? "grid-cols-1 md:grid-cols-3" :
                    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}>
                    {filteredImages.map((image, index) => {
                        const isLarge = (isTheme2 && index % 7 === 0) || (isTheme3 && index === 0);
                        
                        return (
                            <Dialog key={image.id}>
                                <DialogTrigger asChild>
                                    <div className={cn(
                                        "group relative cursor-pointer overflow-hidden transition-all duration-500",
                                        isTheme3 ? "rounded-none" : "rounded-xl",
                                        isLarge ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-square",
                                        isTheme3 && !isLarge && "aspect-square"
                                    )}>
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            className={cn(
                                                "object-cover transition-all duration-700",
                                                (isTheme2 || isTheme3) ? "group-hover:scale-110 group-hover:brightness-110" : "group-hover:scale-105"
                                            )}
                                        />
                                        
                                        {(isTheme2 || isTheme3) ? (
                                            <div className={cn(
                                                "absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-8",
                                                isTheme2 ? "from-black" : "from-[#0d1b3e]"
                                            )}>
                                                <span className={cn(
                                                  "text-[10px] font-bold uppercase tracking-[0.2em] mb-2 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0",
                                                  isTheme2 ? "text-[var(--accent)]" : "text-[#cc2936]"
                                                )}>
                                                  {image.alt.match(/NCC|NSS|Sports/) ? image.alt.split(' ')[0] : 'Campus'}
                                                </span>
                                                <p className="text-white font-bold font-headline text-2xl uppercase leading-tight transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                                                  {image.alt}
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                                <div className="absolute bottom-4 left-4 text-white text-sm font-bold p-2 bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {image.alt}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </DialogTrigger>
                                <DialogContent className={cn("max-w-4xl p-0 overflow-hidden", isTheme2 ? "bg-[#0a0f1e] border-white/10" : isTheme3 ? "bg-white border-[#0d1b3e]/20" : "")}>
                                    <VisuallyHidden>
                                        <DialogTitle>{image.alt}</DialogTitle>
                                    </VisuallyHidden>
                                    <div className="relative aspect-video w-full">
                                        <Image src={image.src} alt={image.alt} fill className="object-contain" />
                                    </div>
                                    <div className={cn("p-8", (isTheme2 || isTheme3) && "text-center")}>
                                        <p className={cn(
                                          "text-xs font-bold uppercase tracking-widest mb-1",
                                          isTheme2 ? "text-[var(--accent)]" : isTheme3 ? "text-[#cc2936]" : "text-primary"
                                        )}>
                                          {image.alt.match(/NCC|NSS|Sports/) ? image.alt.split(' ')[0] : 'Campus'}
                                        </p>
                                        <h2 className={cn("text-3xl font-bold uppercase font-headline", (isTheme2 || isTheme3) ? "text-white" : "", isTheme3 && "text-[#0d1b3e]")}>
                                          {image.alt}
                                        </h2>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
