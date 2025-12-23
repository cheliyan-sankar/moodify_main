"use client";

import React, { useEffect, useRef, useState } from 'react';

type Day = { date: string; count: number };

interface Props {
  data: Day[];
  width?: number | string;
}

export default function DashboardScore({ data = [], width = 340 }: Props) {
  // ensure we have 30 days
  const now = new Date();
  const startDate = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
  const daysMap: Record<string, number> = {};
  data.forEach(d => (daysMap[d.date] = Math.max(daysMap[d.date] ?? 0, d.count)));

  const days: Day[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = d.toISOString().split('T')[0];
    days.push({ date: key, count: daysMap[key] ?? 0 });
  }

  // bucket into 12 columns (similar to SVG layout)
  const cols = 12;
  const bucketSize = Math.ceil(days.length / cols);
  const buckets: { date: string; count: number }[] = [];
  for (let i = 0; i < cols; i++) {
    const slice = days.slice(i * bucketSize, (i + 1) * bucketSize);
    const sum = slice.reduce((s, it) => s + (it.count || 0), 0);
    const label = slice[0]?.date || '';
    buckets.push({ date: label, count: sum });
  }

  const total = buckets.reduce((s, b) => s + b.count, 0);
  const isEmpty = total === 0;
  const max = Math.max(1, ...buckets.map(b => b.count));

  // SVG reference sizes (from dashboard-score.svg)
  const SVG_INNER_WIDTH = 343; // rect width in SVG
  const SVG_BAR_WIDTH = 16; // bar rect width in SVG
  const SVG_STEP = 27; // distance between left edges of bars in SVG
  const SVG_BAR_MAX_H = 137; // rect height in SVG
  const SVG_BAR_MIN_H = 24;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(typeof width === 'number' ? width : null);

  useEffect(() => {
    if (typeof width === 'number') {
      setMeasuredWidth(width);
      return;
    }

    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = Math.max(0, entry.contentRect.width);
        setMeasuredWidth(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const scale = measuredWidth ? measuredWidth / SVG_INNER_WIDTH : 1;
  const maxPx = Math.max(1, Math.round(SVG_BAR_MAX_H * scale));
  const minPx = Math.max(1, Math.round(SVG_BAR_MIN_H * scale));
  const barWidthPx = Math.max(2, Math.round(SVG_BAR_WIDTH * scale));
  const stepPx = Math.max(barWidthPx + 2, Math.round(SVG_STEP * scale));

  const colorFor = (v: number) => {
    if (isEmpty) return '#E5E7EB';
    if (v === 0) return '#E5EAD7';
    const frac = v / max;
    if (frac >= 0.85) return '#450BC8';
    if (frac >= 0.6) return '#D01010';
    return '#89C947';
  };

  return (
    <div ref={containerRef} style={{ width }} className="mx-auto">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md" style={{ backgroundColor: '#89C947' }} />
            <div className="w-4 h-4 rounded-md" style={{ backgroundColor: '#450BC8' }} />
            <div className="w-4 h-4 rounded-md" style={{ backgroundColor: '#D01010' }} />
          </div>
          <div className="bg-[#F7F4F2] rounded-full px-3 py-1 flex items-center gap-2 text-[#450BC8]">
            <div className="w-3 h-3 rounded bg-[#450BC8]" />
            <div className="w-3 h-3 rounded bg-[#450BC8]" />
            <div className="w-3 h-3 rounded bg-[#450BC8]" />
          </div>
        </div>

        <div className="py-3" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0 }}>
            {buckets.map((b, i) => {
              // Each column occupies exactly `stepPx` width, bar centered inside it with `barWidthPx` width
              const colStyle: React.CSSProperties = { width: `${stepPx}px`, display: 'flex', justifyContent: 'center' };

              if (isEmpty) {
                return (
                  <div key={i} style={colStyle}>
                    <div
                      className="rounded-[8px]"
                      title={`${b.date}: ${b.count} activities`}
                      style={{ height: `${maxPx}px`, backgroundColor: '#E5EAD7', width: `${barWidthPx}px`, borderRadius: `${Math.max(4, Math.round(8 * scale))}px` }}
                    />
                  </div>
                );
              }

              const h = Math.round(minPx + ((b.count / max) * (maxPx - minPx)));
              const bg = colorFor(b.count);
              return (
                <div key={i} style={colStyle}>
                  <div
                    className="rounded-[8px]"
                    title={`${b.date}: ${b.count} activities`}
                    style={{ height: `${h}px`, backgroundColor: bg, width: `${barWidthPx}px`, borderRadius: `${Math.max(4, Math.round(8 * scale))}px` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-md bg-[#450BC8]" />
          <div className="flex-1 h-px bg-[#D0BCFF] mx-3" />
          <div className="w-3 h-3 rounded-md bg-[#450BC8]" />
        </div>
      </div>
    </div>
  );
}
