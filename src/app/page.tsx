'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { signInWithGoogle, signOut, onAuthChange } from '@/lib/auth';
import { getGlobalLevel, getTitle, getXPProgress, StatType, STAT_CONFIG } from '@/lib/stats';
import { Task, UserStats, ensureUserStats, addTask, completeTask, deleteTask, subscribeTasks, subscribeStats } from '@/lib/tasks';
import StatCard from '@/components/StatCard';
import TaskList from '@/components/TaskList';
import AddTask from '@/components/AddTask';
import PixelCharacter from '@/components/PixelCharacter';
import PixelIcon from '@/components/PixelIcon';

const STAT_TYPES: StatType[] = ['STR', 'INT', 'END', 'FOC', 'WIL'];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    return onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setStats(null);
      setTasks([]);
      return;
    }

    ensureUserStats(user.uid);

    const unsubStats = subscribeStats(user.uid, setStats);
    const unsubTasks = subscribeTasks(user.uid, setTasks);

    return () => {
      unsubStats();
      unsubTasks();
    };
  }, [user]);

  const handleComplete = useCallback(async (taskId: string, statTag: StatType | null) => {
    if (!user || !stats) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as never } : t
      )
    );

    if (statTag) {
      const field = `${statTag.toLowerCase()}_xp` as keyof UserStats;
      setStats((prev) => prev ? { ...prev, [field]: (prev[field] as number) + 1 } : prev);
    }

    try {
      await completeTask(user.uid, taskId, statTag, stats);
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completedAt: null } : t
        )
      );
      if (statTag) {
        const field = `${statTag.toLowerCase()}_xp` as keyof UserStats;
        setStats((prev) => prev ? { ...prev, [field]: (prev[field] as number) - 1 } : prev);
      }
    }
  }, [user, stats]);

  const handleAddTask = useCallback(async (label: string, statTag: StatType | null) => {
    if (!user) return;
    await addTask(user.uid, label, statTag);
  }, [user]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (!user) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await deleteTask(user.uid, taskId);
    } catch {
      setTasks((prev) => [...prev]);
    }
  }, [user]);

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleSignIn = async () => {
    setLoginError(null);
    setLoginLoading(true);
    try {
      await signInWithGoogle();
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      setLoginError(err.code || err.message || '로그인 실패');
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="text-text-muted" style={{ fontFamily: "'Galmuri11', monospace", fontSize: '13px' }}>
          로딩 중...
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN ───
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg px-6">
        <div className="pixel-box p-8 max-w-xs w-full text-center">
          {/* Character preview */}
          <div className="flex justify-center mb-4">
            <PixelCharacter level={20} />
          </div>

          <div
            className="text-accent mb-3"
            style={{ fontFamily: "var(--font-press-start)", fontSize: '12px', lineHeight: '2' }}
          >
            STATME
          </div>

          {/* RPG dialog style intro */}
          <div className="pixel-box-accent p-3 mb-4 text-left relative">
            <p
              className="text-text"
              style={{ fontFamily: "'Galmuri11', monospace", fontSize: '12px', lineHeight: '1.8' }}
            >
              퀘스트를 완료하고<br />
              캐릭터를 성장시키세요.
            </p>
            <span
              className="absolute bottom-1.5 right-2.5 text-accent"
              style={{ fontSize: '8px', animation: 'pulse 1s steps(2) infinite' }}
            >
              ▼
            </span>
          </div>

          {/* Stat preview */}
          <div className="flex justify-center gap-3 mb-5">
            {STAT_TYPES.map((type) => {
              const config = STAT_CONFIG[type];
              return (
                <div key={type} className="flex flex-col items-center gap-1">
                  <PixelIcon name={config.icon} color={config.color} size={1.5} />
                  <span style={{ fontFamily: "var(--font-press-start)", fontSize: '5px', color: config.color, lineHeight: '2' }}>
                    {type}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSignIn}
            className="w-full py-3 bg-accent border-2 border-accent-hover shadow-[3px_3px_0px] shadow-accent-hover text-white hover:bg-accent-hover active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
            style={{ fontFamily: "'Galmuri11', monospace", fontSize: '13px' }}
          >
            {loginLoading ? '접속 중...' : 'Google로 시작하기'}
          </button>

          {loginError && (
            <div
              className="mt-3 text-danger text-center"
              style={{ fontFamily: "'Galmuri9', monospace", fontSize: '10px', wordBreak: 'break-all' }}
            >
              {loginError}
            </div>
          )}
        </div>

        <p
          className="text-text-faint mt-4"
          style={{ fontFamily: "'Galmuri9', monospace", fontSize: '9px' }}
        >
          현실을 게임처럼. Level up your life.
        </p>
      </div>
    );
  }

  // ─── MAIN APP ───
  const totalXP = stats ? stats.str_xp + stats.int_xp + stats.end_xp + stats.foc_xp + stats.wil_xp : 0;
  const globalLevel = stats ? getGlobalLevel({
    str: stats.str_xp, int: stats.int_xp, end: stats.end_xp,
    foc: stats.foc_xp, wil: stats.wil_xp,
  }) : 0;
  const title = getTitle(globalLevel);
  const nextLevelXP = (globalLevel + 1) * 10;
  const levelProgress = totalXP > 0 ? Math.round((totalXP % 10) / 10 * 100) : 0;

  const completedToday = tasks.filter(t => t.completedAt !== null).length;
  const totalToday = tasks.length;

  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-md mx-auto">

      {/* ─── HEADER ─── */}
      <header className="border-b-[3px] border-border-dark bg-bg-warm">
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span
            className="text-accent"
            style={{ fontFamily: "var(--font-press-start)", fontSize: '7px', lineHeight: '2' }}
          >
            STATME
          </span>
          <button
            onClick={signOut}
            className="text-text-muted hover:text-accent transition-colors"
            style={{ fontFamily: "'Galmuri9', monospace", fontSize: '10px' }}
          >
            logout
          </button>
        </div>

        {/* Character + Level info */}
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="pixel-box p-2.5 bg-bg-warm">
            <PixelCharacter level={globalLevel} />
          </div>
          <div className="flex-1">
            <h1 style={{ fontFamily: "'Galmuri14', monospace", fontSize: '18px', lineHeight: '1.4' }}>
              Lv.{globalLevel}{' '}
              <span className="text-accent">{title}</span>
            </h1>
            <div
              className="text-text-muted mt-0.5"
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px' }}
            >
              {stats?.streak ?? 0}일 연속 · XP {totalXP}
            </div>
            {/* Level progress bar */}
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-[6px] bg-surface-2 border border-border overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-700"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <span
                className="text-text-faint"
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px' }}
              >
                {globalLevel + 1}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── STATS ─── */}
      <div className="px-3 pt-3 pb-1 bg-bg">
        <div className="flex items-center justify-between mb-2 px-1">
          <span
            className="text-text-muted"
            style={{ fontFamily: "'Galmuri9', monospace", fontSize: '9px', letterSpacing: '0.1em' }}
          >
            ▶ STATS
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {STAT_TYPES.map((type) => {
            const field = `${type.toLowerCase()}_xp` as keyof UserStats;
            return (
              <StatCard key={type} type={type} xp={stats ? (stats[field] as number) : 0} />
            );
          })}
        </div>
      </div>

      {/* ─── QUESTS ─── */}
      <div className="flex-1 px-3 pt-3 pb-24 bg-bg">
        <div className="flex items-center justify-between mb-2 px-1">
          <span
            className="text-text-muted"
            style={{ fontFamily: "'Galmuri9', monospace", fontSize: '9px', letterSpacing: '0.1em' }}
          >
            ▶ 오늘의 퀘스트
          </span>
          {totalToday > 0 && (
            <span
              className="text-text-faint"
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px' }}
            >
              {completedToday}/{totalToday}
            </span>
          )}
        </div>
        <div className="pixel-box p-3">
          <TaskList tasks={tasks} onComplete={handleComplete} onDelete={handleDeleteTask} />
        </div>
      </div>

      {/* ─── ADD TASK ─── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <AddTask onAdd={handleAddTask} />
      </div>
    </div>
  );
}
