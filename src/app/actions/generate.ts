'use server';

// ============================================================
// EduPlanner AI - AI Server Actions
// 使用 DeepSeek API（deepseek-chat，国内直连）
// Temperature: 0.7 (PRD 6.3 规范)
// ============================================================

import type { Student, PTOption, PGOption, Activity, TimelineEntry, GenerationOptions } from '@/types';
import {
  buildPTAndPGPrompt,
  buildActivityPrompt,
  buildTimelinePrompt,
} from '@/lib/prompts';

// ─── DeepSeek 调用 helper ─────────────────────────────────────

async function callDeepSeek(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set in environment variables');
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 8192,
      response_format: { type: 'json_object' }, // 强制输出合法 JSON
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error ${response.status}: ${err}`);
  }

  const data = await response.json() as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0].message.content;
}

// ─── JSON 解析 helper（处理 markdown code block）────────────────

function parseJSON<T>(raw: string): T {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```(?:json)?\n?/, '')
      .replace(/\n?```$/, '')
      .trim();
  }
  return JSON.parse(cleaned) as T;
}

// ─── Server Actions ───────────────────────────────────────────

/**
 * 生成 PT 和 PG 选项
 */
export async function generatePTAndPGAction(
  student: Student
): Promise<GenerationOptions> {
  const prompt = buildPTAndPGPrompt(student);
  const raw = await callDeepSeek(prompt);

  try {
    const data = parseJSON<GenerationOptions>(raw);
    if (!Array.isArray(data.ptOptions) || !Array.isArray(data.pgOptions)) {
      throw new Error('Invalid response structure: missing ptOptions or pgOptions');
    }
    return data;
  } catch (err) {
    console.error('Failed to parse PT/PG response:', raw);
    throw new Error(`Failed to parse DeepSeek response: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * 生成 10 项活动方案
 */
export async function generateActivitiesAction(
  student: Student,
  selectedPT: PTOption,
  selectedPGs: PGOption[]
): Promise<Activity[]> {
  const prompt = buildActivityPrompt(student, selectedPT, selectedPGs);
  const raw = await callDeepSeek(prompt);

  try {
    const data = parseJSON<{ activities: Activity[] }>(raw);
    if (!Array.isArray(data.activities)) {
      throw new Error('Invalid response structure: missing activities array');
    }
    return data.activities;
  } catch (err) {
    console.error('Failed to parse Activities response:', raw);
    throw new Error(`Failed to parse DeepSeek response: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * 单项活动重新生成
 */
export async function regenerateActivityAction(
  student: Student,
  selectedPT: PTOption,
  selectedPGs: PGOption[],
  activityIndex: number,
  existingActivities: Activity[]
): Promise<Activity> {
  const target = existingActivities[activityIndex];
  const activitiesSummary = existingActivities
    .map((a, i) => `  ${i + 1}. [${a.category}] ${a.name}${i === activityIndex ? '（需重新生成）' : ''}`)
    .join('\n');

  const prompt = `你是一位资深留学咨询顾问。请重新生成以下活动规划中的第 ${activityIndex + 1} 项活动。

## 学生信息
- 姓名：${student.chineseName}（${student.englishName}）
- 年级：${student.grade}年级 | 专业方向：${student.majors.join('、')}
- PT：${selectedPT.tag}
- PG：${selectedPGs.map(pg => pg.goal).join('；')}

## 当前活动清单
${activitiesSummary}

## 需要重新生成的活动
- 编号：${target.number}
- 分类：${target.category}
- 当前名称：${target.name}

## 要求
请保持相同的活动分类（${target.category}），设计一个更优质、更具体、更有说服力的替代方案。

## 输出格式（严格 JSON，只输出一个活动对象）
{
  "id": "${target.id}",
  "number": ${target.number},
  "category": "${target.category}",
  "name": "新的活动名称",
  "description": "详细描述",
  "outcome": "预期产出成果"
}`;

  const raw = await callDeepSeek(prompt);

  try {
    return parseJSON<Activity>(raw);
  } catch (err) {
    console.error('Failed to parse regenerated activity:', raw);
    throw new Error(`Failed to parse DeepSeek response: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * 生成时间规划
 */
export async function generateTimelineAction(
  student: Student,
  activities: Activity[]
): Promise<TimelineEntry[]> {
  const prompt = buildTimelinePrompt(student, activities);
  const raw = await callDeepSeek(prompt);

  try {
    const data = parseJSON<{ timeline: TimelineEntry[] }>(raw);
    if (!Array.isArray(data.timeline)) {
      throw new Error('Invalid response structure: missing timeline array');
    }
    return data.timeline;
  } catch (err) {
    console.error('Failed to parse Timeline response:', raw);
    throw new Error(`Failed to parse DeepSeek response: ${err instanceof Error ? err.message : String(err)}`);
  }
}
