import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Plan, PlanStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatDateChinese(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

export function getPlanStatusLabel(status: PlanStatus): string {
  const labels: Record<PlanStatus, string> = {
    draft: '草稿',
    generating: 'AI生成中',
    pending_review: '待审核',
    completed: '已完成',
  };
  return labels[status];
}

export function getPlanStatusClasses(status: PlanStatus): string {
  const classes: Record<PlanStatus, string> = {
    draft: 'bg-gray-100 text-gray-600',
    generating: 'bg-blue-100 text-blue-600',
    pending_review: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
  };
  return classes[status];
}

// Get the current plan step URL for resuming
export function getPlanStepUrl(plan: Plan): string {
  const stepUrls: Record<string, string> = {
    intake: `/new-plan`,
    pt_pg_generation: `/plans/${plan.id}/pt-pg`,
    pt_pg_selection: `/plans/${plan.id}/pt-pg`,
    activity_generation: `/plans/${plan.id}/activities`,
    activity_review: `/plans/${plan.id}/activities`,
    timeline_generation: `/plans/${plan.id}/timeline`,
    timeline_review: `/plans/${plan.id}/timeline`,
    review: `/plans/${plan.id}/review`,
    export: `/plans/${plan.id}/export`,
  };
  return stepUrls[plan.currentStep] || `/plans/${plan.id}/review`;
}

export function getGradeLabel(grade: string): string {
  const labels: Record<string, string> = {
    '9': '9年级',
    '10': '10年级',
    '11': '11年级',
    '12': '12年级',
  };
  return labels[grade] || `${grade}年级`;
}

export function getCurriculumLabel(curriculum: string): string {
  const labels: Record<string, string> = {
    IB: 'IB',
    AP: 'AP',
    'A-Level': 'A-Level',
    other: '其他',
  };
  return labels[curriculum] || curriculum;
}
