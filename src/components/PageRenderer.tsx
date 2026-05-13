import { componentMap } from '@/components/blocks/blockRegistry';
import HomeRenderer from './HomeRenderer';

export default function PageRenderer({ blocks, theme }: { blocks: any[], theme?: string }) {
  // We now delegate to the unified HomeRenderer which uses the centralized registry
  return <HomeRenderer blocks={blocks} theme={theme} />;
}

