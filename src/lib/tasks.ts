import {
  collection, doc, setDoc, writeBatch, query, where, orderBy, onSnapshot, Timestamp, or,
} from 'firebase/firestore';
import { db } from './firebase';
import { StatType, getTodayDateString } from './stats';

export interface Task {
  id: string;
  label: string;
  statTag: StatType | null;
  completedAt: Timestamp | null;
  createdAt: Timestamp;
}

export interface UserStats {
  str_xp: number;
  int_xp: number;
  end_xp: number;
  foc_xp: number;
  wil_xp: number;
  streak: number;
  lastActiveDate: string | null;
}

const DEFAULT_STATS: UserStats = {
  str_xp: 0, int_xp: 0, end_xp: 0, foc_xp: 0, wil_xp: 0,
  streak: 0, lastActiveDate: null,
};

const statXPField: Record<StatType, keyof UserStats> = {
  STR: 'str_xp', INT: 'int_xp', END: 'end_xp', FOC: 'foc_xp', WIL: 'wil_xp',
};

export function userStatsRef(uid: string) {
  return doc(db, 'users', uid);
}

export function tasksCollection(uid: string) {
  return collection(db, 'users', uid, 'tasks');
}

export async function ensureUserStats(uid: string): Promise<void> {
  const ref = userStatsRef(uid);
  await setDoc(ref, DEFAULT_STATS, { merge: true });
}

export async function addTask(uid: string, label: string, statTag: StatType | null): Promise<string> {
  const ref = doc(tasksCollection(uid));
  await setDoc(ref, {
    label,
    statTag,
    completedAt: null,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function completeTask(
  uid: string,
  taskId: string,
  statTag: StatType | null,
  currentStats: UserStats
): Promise<void> {
  const batch = writeBatch(db);

  // Update task
  const taskRef = doc(tasksCollection(uid), taskId);
  batch.update(taskRef, { completedAt: Timestamp.now() });

  // Update stats
  const statsRef = userStatsRef(uid);
  const today = getTodayDateString();

  const updates: Record<string, unknown> = { lastActiveDate: today };

  if (statTag) {
    const field = statXPField[statTag];
    updates[field] = (currentStats[field] as number) + 1;
  }

  // Streak logic
  if (currentStats.lastActiveDate !== today) {
    const lastDate = currentStats.lastActiveDate;
    if (!lastDate) {
      updates.streak = 1;
    } else {
      const last = new Date(lastDate);
      const now = new Date(today);
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        updates.streak = currentStats.streak + 1;
      } else if (diffDays > 1) {
        updates.streak = 1;
      }
    }
  }

  batch.update(statsRef, updates);
  await batch.commit();
}

export async function deleteTask(uid: string, taskId: string): Promise<void> {
  const taskRef = doc(tasksCollection(uid), taskId);
  const { deleteDoc } = await import('firebase/firestore');
  await deleteDoc(taskRef);
}

export function subscribeTasks(
  uid: string,
  callback: (tasks: Task[]) => void
): () => void {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = Timestamp.fromDate(today);

  // Query: created today OR not yet completed
  const q = query(
    tasksCollection(uid),
    or(
      where('createdAt', '>=', todayTimestamp),
      where('completedAt', '==', null)
    ),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    } as Task));
    callback(tasks);
  });
}

export function subscribeStats(
  uid: string,
  callback: (stats: UserStats) => void
): () => void {
  return onSnapshot(userStatsRef(uid), (snapshot) => {
    const data = snapshot.data();
    callback(data ? (data as UserStats) : DEFAULT_STATS);
  });
}
