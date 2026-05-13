'use client';

import { componentMap } from '@/components/blocks/blockRegistry';

export interface BlockData {
  id: string;
  type: string;
  visible: boolean;
  data: any;
}

export default function HomeRenderer({ blocks, theme }: { blocks: BlockData[], theme?: string }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((b) => {
        if (!b.visible) return null;
        
        const Component = componentMap[b.type];
        
        if (!Component) {
            console.warn(`No component found for block type: ${b.type}`);
            return process.env.NODE_ENV === 'development' ? (
                <div key={b.id} className="container mx-auto my-4 p-4 border border-dashed border-red-400">
                    <p className="text-red-500 font-bold">Unknown block type: {b.type}</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded-md mt-2">{JSON.stringify(b.data, null, 2)}</pre>
                </div>
            ) : null;
        }

        // Pass the renderer itself so layout blocks can use it for nested content
        return (
          <Component 
            key={b.id} 
            theme={theme} 
            {...b.data} 
            Renderer={HomeRenderer} 
          />
        );
      })}
    </>
  );
}
