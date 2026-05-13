'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { componentMap } from './blocks/blockRegistry';

export interface BlockData {
  id: string;
  type: string;
  visible: boolean;
  data: any;
}

export default function HomeRenderer({ blocks, theme }: { blocks: BlockData[], theme?: string }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((b) => {
        if (!b.visible) return null;

        // Normalize to handle any casing or accidental whitespace from the database
        const normalizedType = b.type?.toLowerCase()?.trim();
        const Component = componentMap[normalizedType];

        if (!Component) {
          // In production this stays silent; in dev it logs the unknown type for debugging
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              `[HomeRenderer] Unknown block type: "${b.type}" (normalized: "${normalizedType}"). ` +
              `Add it to blockRegistry.ts to render it.`
            );
          }
          return null; // Silently skip unknown blocks — no ugly red debug boxes in production
        }

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
