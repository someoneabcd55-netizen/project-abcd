
import { getGalleryImages } from '@/firebase/services/gallery';
import { GalleryClient } from './gallery-client';
import { unstable_noStore as noStore } from 'next/cache';


export default async function GalleryPage() {
    noStore(); // Ensure fresh data on every request
    const images = await getGalleryImages();

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl text-center">
            Campus Life Gallery
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground text-center">
            A glimpse into the vibrant life at G V Hallikeri PU college.
        </p>
        <GalleryClient initialImages={images} />
        </div>
    );
}
