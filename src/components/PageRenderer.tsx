import { HeroSection } from '@/components/home/hero-section';
import { TextBlock } from '@/components/home/text-block';
import { ImageBlock } from '@/components/home/image-block';
import { AnnouncementsSection } from './home/announcements-section';
import { StatsRow } from '@/components/home/stats-row';
import { FeatureCards } from '@/components/home/feature-cards';

const componentMap: Record<string, any> = {
  hero: HeroSection,
  text: TextBlock,
  image: ImageBlock,
  announcements: AnnouncementsSection,
  stats: StatsRow,
  features: FeatureCards,
};

export default function PageRenderer({ blocks, theme }: { blocks: any[], theme?: string }) {
  if (blocks.length === 0) {
    return (
        <div className="container mx-auto my-12 text-center text-muted-foreground">
             <p className='font-bold text-2xl'>Empty Page</p>
            <p>This page is empty. An administrator can add content blocks in the admin dashboard.</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col">
      {blocks.map((b) => {
        if (!b.visible) return null;
        const Component = componentMap[b.type];
        if (!Component) {
            console.warn(`No component found for block type: ${b.type}`);
            return (
                <div key={b.id} className="container mx-auto my-4 p-4 border border-dashed border-red-400">
                    <p className="text-red-500 font-bold">Unknown block type: {b.type}</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded-md mt-2">{JSON.stringify(b.data, null, 2)}</pre>
                </div>
            )
        }
        return <Component key={b.id} theme={theme} {...b.data} />;
      })}
    </div>
  );
}
