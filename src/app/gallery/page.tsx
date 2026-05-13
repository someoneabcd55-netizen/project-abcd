import { getPageBlocks } from '@/firebase/services/blocks';
import { unstable_noStore as noStore } from 'next/cache';
import { getAppearanceSettings } from '@/firebase/services/settings';
import HomeRenderer from '@/components/HomeRenderer';
import { PageHeader } from '@/components/layout/page-header';

export default async function GalleryPage() {
    noStore();
    const [blocks, appearance] = await Promise.all([
        getPageBlocks('gallery'),
        getAppearanceSettings(),
    ]);

    if (!blocks) {
        return (
            <div>
                <PageHeader 
                    eyebrow="Campus Life"
                    title="Our Gallery" 
                    description="Explore our vibrant campus life."
                    theme={appearance?.theme}
                />
                <div className="container mx-auto px-4 py-32 text-center">
                    <p className="text-muted-foreground">Gallery content is coming soon.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <HomeRenderer blocks={blocks} theme={appearance?.theme} />
        </div>
    );
}
