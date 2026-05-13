import { getPageBlocks } from '@/firebase/services/blocks';
import { getAppearanceSettings } from '@/firebase/services/settings';
import HomeRenderer from '@/components/HomeRenderer';
import { PageHeader } from '@/components/layout/page-header';
import { unstable_noStore as noStore } from 'next/cache';

export default async function GalleryPage() {
    noStore();
    
    try {
        const [blocks, appearance] = await Promise.all([
            getPageBlocks('glimpses').then(b => (b && b.length > 0) ? b : getPageBlocks('gallery')),
            getAppearanceSettings(),
        ]);

        if (!blocks || blocks.length === 0) {
            return (
                <div className="min-h-screen bg-background">
                    <PageHeader 
                        eyebrow="Visual Journey"
                        title="Glimpses" 
                        description="Capturing the spirit and moments of our campus life."
                        theme={appearance?.theme}
                    />
                    <div className="container mx-auto px-4 py-32 text-center">
                        <div className="max-w-md mx-auto p-8 border-2 border-dashed border-muted rounded-[2rem] bg-muted/20">
                            <p className="text-muted-foreground font-medium mb-4">Gallery content is currently being updated.</p>
                            <p className="text-xs text-muted-foreground/60 italic">Please check back soon or add gallery blocks in the admin dashboard.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-background pb-20">
                <HomeRenderer blocks={blocks} theme={appearance?.theme} />
            </div>
        );
    } catch (error) {
        console.error('Gallery Page Error:', error);
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center space-y-6 max-w-lg">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-red-600 text-2xl font-bold">!</span>
                    </div>
                    <h1 className="text-3xl font-bold">Something went wrong</h1>
                    <p className="text-muted-foreground">We encountered an error loading the gallery. Our team has been notified.</p>
                    <a href="/" className="inline-block px-8 py-3 bg-navy text-white rounded-full font-bold transition-transform hover:scale-105">
                        Return Home
                    </a>
                </div>
            </div>
        );
    }
}
