'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TableProps {
  title?: string;
  subtitle?: string;
  headers: string[];
  rows: string[][];
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  responsive?: boolean;
  caption?: string;
}

export function TableBlock({
  title,
  subtitle,
  headers = [],
  rows = [],
  striped = true,
  bordered = false,
  hoverable = true,
  responsive = true,
  caption,
}: TableProps) {
  return (
    <section className="py-12 px-6 container mx-auto">
      {(title || subtitle) && (
        <div className="mb-8 text-left">
          {title && <h3 className="text-2xl font-bold mb-2">{title}</h3>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div className={cn("w-full", responsive && "overflow-x-auto")}>
        <table className={cn(
          "w-full text-left border-collapse",
          bordered && "border border-border"
        )}>
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {headers.map((header, i) => (
                <th key={i} className="p-4 font-bold text-sm uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr 
                key={i} 
                className={cn(
                  "border-b border-border/50 transition-colors",
                  striped && i % 2 === 0 && "bg-muted/20",
                  hoverable && "hover:bg-accent-color/5"
                )}
              >
                {row.map((cell, j) => (
                  <td key={j} className="p-4 text-sm">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {caption && <p className="mt-4 text-sm text-muted-foreground italic text-center">{caption}</p>}
      </div>
    </section>
  );
}
