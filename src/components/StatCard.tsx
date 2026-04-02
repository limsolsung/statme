'use client';

import { StatType, STAT_CONFIG, getStatLevel, getXPProgress } from '@/lib/stats';
import PixelIcon from './PixelIcon';

interface StatCardProps {
  type: StatType;
  xp: number;
}

export default function StatCard({ type, xp }: StatCardProps) {
  const config = STAT_CONFIG[type];
  const level = getStatLevel(xp);
  const progress = getXPProgress(xp);

  return (
    <div className="pixel-box p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <PixelIcon name={config.icon} color={config.color} size={2} />
        <div>
          <span
            className="text-text-muted block"
            style={{ fontFamily: "'Galmuri9', monospace", fontSize: '10px', lineHeight: '1.6', fontWeight: 600 }}
          >
            {config.label}
          </span>
          <span
            className="text-text-faint block"
            style={{ fontFamily: "'Galmuri9', monospace", fontSize: '10px', lineHeight: '1.4' }}
          >
            {config.desc}
          </span>
        </div>
      </div>
      <div
        className="font-semibold leading-tight mb-1.5"
        style={{ color: config.color, fontFamily: "'IBM Plex Mono', monospace", fontSize: '24px' }}
      >
        {xp}
      </div>
      <div className="h-1.5 bg-surface-2 border border-border overflow-hidden rounded-sm">
        <div
          className="h-full transition-all duration-500 rounded-sm"
          style={{ width: `${progress.percentage}%`, backgroundColor: config.color }}
        />
      </div>
      <div
        className="text-text-muted mt-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px' }}
      >
        Lv.{level} · {progress.current}/{progress.required}
      </div>
    </div>
  );
}
