'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { GalleryImage } from '@/firebase/services/gallery';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function GalleryClient({ initialImages }: { initialImages: GalleryImage[] }) {
    const [images] = useState(initialImages);

    const validImages = images.filter(img => img.src && img.src.startsWith('http'));

    return (
        <>
            {validImages.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <p>The gallery is currently empty.</p>
                </div>
            ) : (
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {validImages.map((image) => (
                    <Dialog key={image.id}>
                        <DialogTrigger asChild>
                        <div className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                data-ai-hint={image.dataAiHint}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                            <div className="absolute bottom-2 left-2 text-white text-sm p-2 rounded-md bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                {image.alt}
                            </div>
                        </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl p-0">
                          <VisuallyHidden>
                            <DialogTitle>{image.alt}</DialogTitle>
                          </VisuallyHidden>
                          <Image
                              src={image.src}
                              alt={image.alt}
                              width={1200}
                              height={800}
                              className="w-full h-auto rounded-lg"
                          />
                        </DialogContent>
                    </Dialog>
                    ))}
                </div>
            )}
        </>
    );
}
