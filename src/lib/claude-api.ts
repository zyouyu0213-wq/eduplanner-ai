// ============================================================
// EduPlanner AI - AI 生成层
// Mock 模式：直接返回 mock 数据（模拟加载延迟）
// Real 模式：调用 Server Action 请求 Claude API
// ============================================================

import type { Student, GenerationOptions, Activity, TimelineEntry, PTOption, PGOption } from '@/types';
import {
  MOCK_GENERATION_OPTIONS,
  MOCK_ACTIVITIES,
  MOCK_TIMELINE,
} from './mock-data';

// ─── Mock/Real 模式切换 ───────────────────────────────────────
// 开发阶段使用 Mock，设置 NEXT_PUBLIC_USE_MOCK_AI=false 可切换到真实 API
const USE_MOCK =
  typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_USE_MOCK_AI !== 'false'
    : true;

// ─── 延迟模拟（让 mock 体验更真实）──────────────────────────

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── 主要 API 函数 ────────────────────────────────────────────

/**
 * Step 3: 生成 PT 和 PG 备选方案
 */
export async function generatePTAndPG(
  student: Student
): Promise<GenerationOptions> {
  if (USE_MOCK) {
    await simulateDelay(2500);
    return MOCK_GENERATION_OPTIONS;
  }
  // 真实 API 调用（后期启用）
  const { generatePTAndPGAction } = await import('@/app/actions/generate');
  return generatePTAndPGAction(student);
}

/**
 * Step 4: 生成 10 项活动方案
 */
export async function generateActivities(
  student: Student,
  selectedPT: PTOption,
  selectedPGs: PGOption[]
): Promise<Activity[]> {
  if (USE_MOCK) {
    await simulateDelay(3000);
    return MOCK_ACTIVITIES;
  }
  const { generateActivitiesAction } = await import('@/app/actions/generate');
  return generateActivitiesAction(student, selectedPT, selectedPGs);
}

/**
 * 单项活动重新生成
 */
export async function regenerateActivity(
  student: Student,
  selectedPT: PTOption,
  selectedPGs: PGOption[],
  activityIndex: number,
  existingActivities: Activity[]
): Promise<Activity> {
  if (USE_MOCK) {
    await simulateDelay(1500);
    // 返回同一项活动，稍微修改描述表示"重新生成了"
    const original = existingActivities[activityIndex];
    return {
      ...original,
      description: original.description + '\n\n（已根据最新信息优化描述）',
    };
  }
  const { regenerateActivityAction } = await import('@/app/actions/generate');
  return regenerateActivityAction(
    student,
    selectedPT,
    selectedPGs,
    activityIndex,
    existingActivities
  );
}

/**
 * Step 5: 生成月度时间规划
 */
export async function generateTimeline(
  student: Student,
  activities: Activity[]
): Promise<TimelineEntry[]> {
  if (USE_MOCK) {
    await simulateDelay(2500);
    return MOCK_TIMELINE;
  }
  const { generateTimelineAction } = await import('@/app/actions/generate');
  return generateTimelineAction(student, activities);
}

// ─── 导出工具函数 ─────────────────────────────────────────────

export { USE_MOCK };
