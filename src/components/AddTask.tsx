'use client';

import { useState } from 'react';
import { StatType, STAT_CONFIG } from '@/lib/stats';
import PixelIcon from './PixelIcon';

interface AddTaskProps {
  onAdd: (label: string, statTag: StatType | null) => void;
}

const STAT_OPTIONS: (StatType | null)[] = [null, 'STR', 'INT', 'END', 'FOC', 'WIL'];

export default function AddTask({ onAdd }: AddTaskProps) {
  const [label, setLabel] = useState('');
  const [statTag, setStatTag] = useState<StatType | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    onAdd(trimmed, statTag);
    setLabel('');
    setStatTag(null);
  }

  const activeConfig = statTag ? STAT_CONFIG[statTag] : null;

  return (
    <form onSubmit={handleSubmit} className="border-t-[3px] border-border-dark p-3 bg-surface">
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {STAT_OPTIONS.map((s) => {
          const isActive = statTag === s;
          const config = s ? STAT_CONFIG[s] : null;
          return (
            <button
              key={s ?? 'none'}
              type="button"
              onClick={() => setStatTag(s)}
              className={`border-2 px-2.5 py-1 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1 ${
                isActive
                  ? 'shadow-[2px_2px_0px]'
                  : 'border-border-dark bg-surface text-text-muted'
              }`}
              style={{
                fontFamily: "var(--font-press-start)",
                fontSize: '6px',
                lineHeight: '2.5',
                ...(isActive && config
                  ? { borderColor: config.color, color: config.color, boxShadow: `2px 2px 0px ${config.color}40` }
                  : isActive
                  ? { borderColor: 'var(--accent)', color: 'var(--accent)' }
                  : {}),
              }}
            >
              {config && <PixelIcon name={config.icon} color={isActive ? config.color : '#8B7355'} size={1.5} />}
              {s ?? 'NONE'}
            </button>
          );
        })}
      </div>
      {activeConfig && (
        <div
          className="mb-2 px-1"
          style={{ fontFamily: "'Galmuri9', monospace", fontSize: '10px', color: activeConfig.color }}
        >
          {activeConfig.desc} — {activeConfig.examples}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={activeConfig ? activeConfig.examples.split(', ')[0] + '...' : '새 퀘스트...'}
          className="flex-1 px-3 py-2 border-2 border-border-dark bg-bg text-text text-[13px] outline-none focus:border-accent"
          style={{ fontFamily: "'Galmuri11', monospace" }}
        />
        <button
          type="submit"
          disabled={!label.trim()}
          className="w-9 h-9 bg-accent border-2 border-accent-hover shadow-[2px_2px_0px] shadow-accent-hover text-white text-lg flex items-center justify-center disabled:opacity-30 active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
          style={{ fontFamily: "'Galmuri14', monospace" }}
        >
          +
        </button>
      </div>
    </form>
  );
}
