import { getPageBlocks } from '@/firebase/services/blocks';
import HomeRenderer from '@/components/HomeRenderer';
import { notFound } from 'next/navigation';
import { getAppearanceSettings } from '@/firebase/services/settings';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
    const [blocks, appearance] = await Promise.all([
        getPageBlocks('home'),
        getAppearanceSettings(),
    ]);

    if (!blocks) {
        return <div className="container mx-auto my-12 text-center text-muted-foreground">
            <p className='font-bold text-2xl'>Welcome!</p>
            <p>This page is not yet configured. An administrator can add content blocks in the admin dashboard.</p>
        </div>
    }

    return <HomeRenderer blocks={blocks} theme={appearance?.theme} />;
}
