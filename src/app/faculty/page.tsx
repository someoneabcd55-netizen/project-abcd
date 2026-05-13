import { getPageBlocks } from '@/firebase/services/blocks';
import HomeRenderer from '@/components/HomeRenderer';
import { getAppearanceSettings } from '@/firebase/services/settings';

export const revalidate = 3600; // Revalidate every hour

export default async function FacultyPage() {
  const [blocks, appearance] = await Promise.all([
    getPageBlocks('faculty'),
    getAppearanceSettings(),
  ]);

  if (!blocks || blocks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Faculty</h1>
        <p className="text-muted-foreground">This page is not yet configured. Add blocks in the admin dashboard.</p>
      </div>
    );
  }

  return <HomeRenderer blocks={blocks} theme={appearance?.theme} />;
}
