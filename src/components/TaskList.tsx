'use client';

import { Task } from '@/lib/tasks';
import { STAT_CONFIG, StatType } from '@/lib/stats';
import PixelIcon from './PixelIcon';

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskId: string, statTag: StatType | null) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskList({ tasks, onComplete, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-text-muted py-8" style={{ fontFamily: "'Galmuri11', monospace", fontSize: '13px' }}>
        아직 퀘스트가 없어요. 아래에서 추가해보세요!
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => {
        const isCompleted = task.completedAt !== null;
        const config = task.statTag ? STAT_CONFIG[task.statTag] : null;

        return (
          <div key={task.id} className="flex items-center gap-2.5 py-2.5 border-b border-dashed border-border group">
            <button
              onClick={() => !isCompleted && onComplete(task.id, task.statTag)}
              disabled={isCompleted}
              className={`w-[18px] h-[18px] border-2 rounded-sm flex-shrink-0 flex items-center justify-center transition-all ${
                isCompleted
                  ? 'bg-success border-[#4A9648] text-white'
                  : 'border-border-dark bg-surface hover:border-accent'
              }`}
              style={{ fontFamily: "'Galmuri9', monospace", fontSize: '9px' }}
            >
              {isCompleted && '✓'}
            </button>
            <div className="flex-1 min-w-0">
              <div
                className={isCompleted ? 'line-through text-text-muted' : 'text-text'}
                style={{ fontFamily: "'Galmuri11', monospace", fontSize: '13px' }}
              >
                {task.label}
              </div>
              {config && (
                <span
                  className="inline-flex items-center gap-1 mt-1 border rounded-sm"
                  style={{
                    fontSize: '9px',
                    lineHeight: '1.8',
                    padding: '2px 6px',
                    borderColor: config.color,
                    color: config.color,
                    backgroundColor: config.color + '0F',
                    fontFamily: "'Galmuri9', monospace",
                  }}
                >
                  <PixelIcon name={config.icon} color={config.color} size={1.5} />
                  {config.label} +1
                </span>
              )}
            </div>
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 text-text-faint hover:text-danger transition-opacity text-xs flex-shrink-0"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
