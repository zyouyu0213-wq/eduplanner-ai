'use client';

import type { Student, Plan, PlanStatus, PlanStep, AppSettings } from '@/types';
import { generateId } from './utils';

// ─── Storage Keys ─────────────────────────────────────────────

const KEYS = {
  students: 'eduplanner_students',
  plans: 'eduplanner_plans',
  settings: 'eduplanner_settings',
} as const;

// ─── Helper: Safe JSON read/write ────────────────────────────

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write to localStorage key "${key}":`, e);
  }
}

// ─── Student Storage ──────────────────────────────────────────

export const StudentStorage = {
  getAll(): Student[] {
    return readJSON<Student[]>(KEYS.students, []);
  },

  getById(id: string): Student | null {
    const all = this.getAll();
    return all.find((s) => s.id === id) ?? null;
  },

  create(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Student {
    const now = new Date().toISOString();
    const student: Student = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const all = this.getAll();
    writeJSON(KEYS.students, [...all, student]);
    return student;
  },

  update(id: string, data: Partial<Omit<Student, 'id' | 'createdAt'>>): Student {
    const all = this.getAll();
    const idx = all.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Student ${id} not found`);
    const updated: Student = {
      ...all[idx],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    writeJSON(KEYS.students, all);
    return updated;
  },

  delete(id: string): void {
    const all = this.getAll().filter((s) => s.id !== id);
    writeJSON(KEYS.students, all);
    // Also delete associated plans
    const plans = PlanStorage.getAll().filter((p) => p.studentId !== id);
    writeJSON(KEYS.plans, plans);
  },
};

// ─── Plan Storage ─────────────────────────────────────────────

export const PlanStorage = {
  getAll(): Plan[] {
    return readJSON<Plan[]>(KEYS.plans, []);
  },

  getById(id: string): Plan | null {
    return this.getAll().find((p) => p.id === id) ?? null;
  },

  getByStudentId(studentId: string): Plan[] {
    return this.getAll().filter((p) => p.studentId === studentId);
  },

  create(studentId: string): Plan {
    const now = new Date().toISOString();
    const plan: Plan = {
      id: generateId(),
      studentId,
      status: 'draft',
      currentStep: 'pt_pg_generation',
      createdAt: now,
      updatedAt: now,
    };
    const all = this.getAll();
    writeJSON(KEYS.plans, [...all, plan]);
    return plan;
  },

  update(id: string, data: Partial<Omit<Plan, 'id' | 'studentId' | 'createdAt'>>): Plan {
    const all = this.getAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Plan ${id} not found`);
    const updated: Plan = {
      ...all[idx],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    writeJSON(KEYS.plans, all);
    return updated;
  },

  updateStatus(id: string, status: PlanStatus): Plan {
    return this.update(id, { status });
  },

  updateStep(id: string, step: PlanStep): Plan {
    return this.update(id, { currentStep: step });
  },

  delete(id: string): void {
    const all = this.getAll().filter((p) => p.id !== id);
    writeJSON(KEYS.plans, all);
  },
};

// ─── Settings Storage ─────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  useMockData: true,
};

export const SettingsStorage = {
  get(): AppSettings {
    return readJSON<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);
  },

  update(data: Partial<AppSettings>): AppSettings {
    const current = this.get();
    const updated = { ...current, ...data };
    writeJSON(KEYS.settings, updated);
    return updated;
  },
};

// ─── Stats helper ─────────────────────────────────────────────

export function getDashboardStats() {
  const students = StudentStorage.getAll();
  const plans = PlanStorage.getAll();
  return {
    totalStudents: students.length,
    totalPlans: plans.length,
    pendingReview: plans.filter((p) => p.status === 'pending_review').length,
    completed: plans.filter((p) => p.status === 'completed').length,
  };
}

// ─── Recent plans helper ──────────────────────────────────────

export function getRecentPlans(limit = 10) {
  const plans = PlanStorage.getAll()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);

  return plans.map((plan) => ({
    plan,
    student: StudentStorage.getById(plan.studentId),
  }));
}
