'use client';

import { useState } from 'react';

const PX = 3;
const COLS = 12;
const ROWS = 12;

const CHARACTER: number[][] = [
  [ 0, 0, 0, 0, 0,20,20, 0, 0, 0, 0, 0],
  [ 0, 0, 0, 0,17,16,16,17, 0, 0, 0, 0],
  [ 0, 0, 0,14,13,12,12,13,14, 0, 0, 0],
  [ 0, 0, 0, 8, 7,-1,-1, 7, 8, 0, 0, 0],
  [ 0, 0, 0, 8, 6, 5, 5, 6, 8, 0, 0, 0],
  [ 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0],
  [ 0, 0, 0, 3, 3, 2, 2, 3, 3, 0, 0, 0],
  [ 0, 0,18, 3, 2, 1, 1, 2, 3,18, 0, 0],
  [ 0, 0,19, 3, 3, 2, 2, 3, 3,19, 0, 0],
  [ 0, 0, 0, 0, 9, 0, 0, 9, 0, 0, 0, 0],
  [ 0, 0, 0, 0,10, 0, 0,10, 0, 0, 0, 0],
  [ 0, 0, 0,15,11, 0, 0,11,15, 0, 0, 0],
];

const TOTAL_PIXELS = CHARACTER.flat().filter(v => v > 0).length;

function renderShadows(level: number, accentColor: string): string {
  const eyesVisible = level >= 8;
  const shadows: string[] = [];

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = CHARACTER[y][x];
      if (cell === -1 && eyesVisible) {
        shadows.push(`${x * PX}px ${y * PX}px 0 #3D2C1E`);
      } else if (cell > 0 && cell <= level) {
        shadows.push(`${x * PX}px ${y * PX}px 0 ${accentColor}`);
      }
    }
  }
  return shadows.join(',');
}

interface PixelCharacterProps {
  level: number;
  accentColor?: string;
}

export default function PixelCharacter({ level, accentColor = '#E8734A' }: PixelCharacterProps) {
  const [showGrowth, setShowGrowth] = useState(false);
  const [previewLevel, setPreviewLevel] = useState(level);

  const displayLevel = showGrowth ? previewLevel : level;
  const shadows = renderShadows(displayLevel, accentColor);
  const filledCount = CHARACTER.flat().filter(v => v > 0 && v <= displayLevel).length;
  const pct = Math.round((filledCount / TOTAL_PIXELS) * 100);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Character */}
      <button
        onClick={() => setShowGrowth(!showGrowth)}
        style={{ width: COLS * PX, height: ROWS * PX, position: 'relative', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
      >
        {shadows ? (
          <div style={{ position: 'absolute', top: 0, left: 0, width: PX, height: PX, boxShadow: shadows }} />
        ) : (
          <div style={{ width: PX, height: PX, position: 'absolute', top: Math.floor(ROWS / 2) * PX, left: Math.floor(COLS / 2) * PX, background: accentColor, opacity: 0.3 }} />
        )}
      </button>

      {/* Percentage */}
      <div className="text-text-faint text-center" style={{ fontFamily: "'Galmuri9', monospace", fontSize: '9px' }}>
        {pct}%
      </div>

      {/* Growth slider */}
      {showGrowth && (
        <div className="flex items-center gap-1.5 mt-1">
          <button
            onClick={() => setPreviewLevel(Math.max(0, previewLevel - 1))}
            className="text-text-muted hover:text-accent"
            style={{ fontFamily: "'Galmuri11', monospace", fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
          >
            ◀
          </button>
          <span
            className="text-accent min-w-[32px] text-center"
            style={{ fontFamily: "var(--font-press-start)", fontSize: '7px', lineHeight: '2' }}
          >
            {previewLevel}
          </span>
          <button
            onClick={() => setPreviewLevel(Math.min(20, previewLevel + 1))}
            className="text-text-muted hover:text-accent"
            style={{ fontFamily: "'Galmuri11', monospace", fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
