export type StatType = 'STR' | 'INT' | 'END' | 'FOC' | 'WIL';

export type StatIcon = 'sword' | 'book' | 'shield' | 'target' | 'flame';

export const STAT_CONFIG: Record<StatType, { label: string; icon: StatIcon; color: string; desc: string; examples: string }> = {
  STR: { label: '체력', icon: 'sword', color: '#E8453C', desc: '운동·신체활동', examples: '달리기, 헬스, 스트레칭' },
  INT: { label: '지력', icon: 'book', color: '#4A7DB8', desc: '학습·공부', examples: '독서, 강의, 코딩' },
  END: { label: '지구력', icon: 'shield', color: '#5DB85A', desc: '건강·루틴', examples: '식단, 수면, 물 마시기' },
  FOC: { label: '집중', icon: 'target', color: '#9B59B6', desc: '집중·몰입', examples: '명상, 딥워크, 정리' },
  WIL: { label: '의지력', icon: 'flame', color: '#E8A634', desc: '도전·절제', examples: '금연, SNS 줄이기, 기상' },
};

export function getStatLevel(xp: number): number {
  if (xp <= 0) return 1;

  // Lv 1-10: 10 XP per level (total 100 XP for Lv 10)
  if (xp <= 100) {
    return Math.floor(xp / 10) + 1;
  }

  // Lv 11+: 20 XP per level
  return 10 + Math.floor((xp - 100) / 20) + 1;
}

export function getGlobalLevel(stats: Record<string, number>): number {
  const totalXP = Object.values(stats).reduce((sum, xp) => sum + xp, 0);
  return Math.floor(totalXP / 10);
}

export function getTitle(level: number): string {
  if (level <= 5) return '초보 모험가';
  if (level <= 10) return '견습 전사';
  if (level <= 20) return '숙련 용사';
  return '마스터';
}

export function getXPProgress(xp: number): { current: number; required: number; percentage: number } {
  if (xp <= 0) return { current: 0, required: 10, percentage: 0 };

  if (xp <= 100) {
    const current = xp % 10;
    return { current, required: 10, percentage: (current / 10) * 100 };
  }

  const xpAfter100 = xp - 100;
  const current = xpAfter100 % 20;
  return { current, required: 20, percentage: (current / 20) * 100 };
}

export function getStreakStatus(
  lastActiveDate: string | null,
  today: string
): { streak: number; shouldReset: boolean; shouldIncrement: boolean } {
  if (!lastActiveDate) {
    return { streak: 0, shouldReset: false, shouldIncrement: true };
  }

  const last = new Date(lastActiveDate);
  const now = new Date(today);
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { streak: 0, shouldReset: false, shouldIncrement: false };
  }
  if (diffDays === 1) {
    return { streak: 0, shouldReset: false, shouldIncrement: true };
  }
  // 2+ days gap
  return { streak: 0, shouldReset: true, shouldIncrement: true };
}

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
