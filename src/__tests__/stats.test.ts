import { describe, it, expect } from 'vitest';
import {
  getStatLevel, getGlobalLevel, getTitle, getXPProgress, getStreakStatus, getTodayDateString,
} from '@/lib/stats';

describe('getStatLevel', () => {
  it('returns 1 for 0 XP', () => {
    expect(getStatLevel(0)).toBe(1);
  });

  it('returns 1 for negative XP', () => {
    expect(getStatLevel(-5)).toBe(1);
  });

  it('returns correct levels in Lv 1-10 range (10 XP per level)', () => {
    expect(getStatLevel(1)).toBe(1);
    expect(getStatLevel(9)).toBe(1);
    expect(getStatLevel(10)).toBe(2);
    expect(getStatLevel(50)).toBe(6);
    expect(getStatLevel(99)).toBe(10);
    expect(getStatLevel(100)).toBe(11);
  });

  it('returns correct levels in Lv 11+ range (20 XP per level)', () => {
    expect(getStatLevel(101)).toBe(11);
    expect(getStatLevel(119)).toBe(11);
    expect(getStatLevel(120)).toBe(12);
    expect(getStatLevel(200)).toBe(16);
  });
});

describe('getGlobalLevel', () => {
  it('returns 0 for all zero stats', () => {
    expect(getGlobalLevel({ str: 0, int: 0, end: 0, foc: 0, wil: 0 })).toBe(0);
  });

  it('calculates floor(total / 10)', () => {
    expect(getGlobalLevel({ str: 5, int: 5, end: 0, foc: 0, wil: 0 })).toBe(1);
    expect(getGlobalLevel({ str: 10, int: 10, end: 10, foc: 10, wil: 10 })).toBe(5);
    expect(getGlobalLevel({ str: 100, int: 0, end: 0, foc: 0, wil: 0 })).toBe(10);
  });

  it('handles single high stat', () => {
    expect(getGlobalLevel({ str: 200, int: 0, end: 0, foc: 0, wil: 0 })).toBe(20);
  });
});

describe('getTitle', () => {
  it('returns 초보 모험가 for levels 0-5', () => {
    expect(getTitle(0)).toBe('초보 모험가');
    expect(getTitle(5)).toBe('초보 모험가');
  });

  it('returns 견습 전사 for levels 6-10', () => {
    expect(getTitle(6)).toBe('견습 전사');
    expect(getTitle(10)).toBe('견습 전사');
  });

  it('returns 숙련 용사 for levels 11-20', () => {
    expect(getTitle(11)).toBe('숙련 용사');
    expect(getTitle(20)).toBe('숙련 용사');
  });

  it('returns 마스터 for levels 21+', () => {
    expect(getTitle(21)).toBe('마스터');
    expect(getTitle(100)).toBe('마스터');
  });
});

describe('getXPProgress', () => {
  it('returns 0% for 0 XP', () => {
    const result = getXPProgress(0);
    expect(result.current).toBe(0);
    expect(result.required).toBe(10);
    expect(result.percentage).toBe(0);
  });

  it('calculates progress in Lv 1-10 range', () => {
    const result = getXPProgress(15);
    expect(result.current).toBe(5);
    expect(result.required).toBe(10);
    expect(result.percentage).toBe(50);
  });

  it('handles exact level boundary', () => {
    const result = getXPProgress(10);
    expect(result.current).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it('calculates progress in Lv 11+ range', () => {
    const result = getXPProgress(110);
    expect(result.current).toBe(10);
    expect(result.required).toBe(20);
    expect(result.percentage).toBe(50);
  });

  it('handles exact level boundary in Lv 11+ range', () => {
    const result = getXPProgress(120);
    expect(result.current).toBe(0);
    expect(result.required).toBe(20);
    expect(result.percentage).toBe(0);
  });
});

describe('getStreakStatus', () => {
  it('returns increment for null lastActiveDate', () => {
    const result = getStreakStatus(null, '2026-03-28');
    expect(result.shouldIncrement).toBe(true);
    expect(result.shouldReset).toBe(false);
  });

  it('returns no change for same day', () => {
    const result = getStreakStatus('2026-03-28', '2026-03-28');
    expect(result.shouldIncrement).toBe(false);
    expect(result.shouldReset).toBe(false);
  });

  it('returns increment for consecutive day', () => {
    const result = getStreakStatus('2026-03-27', '2026-03-28');
    expect(result.shouldIncrement).toBe(true);
    expect(result.shouldReset).toBe(false);
  });

  it('returns reset for 2+ day gap', () => {
    const result = getStreakStatus('2026-03-25', '2026-03-28');
    expect(result.shouldIncrement).toBe(true);
    expect(result.shouldReset).toBe(true);
  });
});

describe('getTodayDateString', () => {
  it('returns a date string in YYYY-MM-DD format', () => {
    const result = getTodayDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
