// ============================================================
// EduPlanner AI - 核心类型定义
// ============================================================

// ─── 学生信息 ───────────────────────────────────────────────

export type Gender = 'male' | 'female';
export type Grade = '9' | '10' | '11' | '12';
export type Curriculum = 'IB' | 'AP' | 'A-Level' | 'other';

export interface Student {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Step 1: Basic Info
  chineseName: string;
  englishName: string;
  gender: Gender;
  grade: Grade;
  school: string;
  curriculum: Curriculum;
  gpa: string;
  testGoals?: string;
  mbti?: string;
  // Step 2: Academic Background
  favoriteSubjects: string[];
  hobbies: string;
  curiosity: string;
  // Step 3: Experience
  existingActivities?: string;
  parentBackground?: string;
  // Step 4: Professional Direction
  majors: string[];
  targetCountries: string[];
}

// ─── 方案状态 ────────────────────────────────────────────────

export type PlanStatus = 'draft' | 'generating' | 'pending_review' | 'completed';

export type PlanStep =
  | 'intake'
  | 'pt_pg_generation'
  | 'pt_pg_selection'
  | 'activity_generation'
  | 'activity_review'
  | 'timeline_generation'
  | 'timeline_review'
  | 'review'
  | 'export';

// ─── PT & PG ─────────────────────────────────────────────────

export interface PTOption {
  id: string;
  tag: string;          // e.g., "书法绘画 × 文创设计师"
  description: string;  // 2-3 句说明
}

export interface PGOption {
  id: string;
  major: string;
  goal: string;
  rationale: string;    // 为什么适合该学生
}

export interface GenerationOptions {
  ptOptions: PTOption[];
  pgOptions: PGOption[];
}

// ─── 活动 ────────────────────────────────────────────────────

export type ActivityCategory =
  | 'research'
  | 'club'
  | 'personal_project'
  | 'internship'
  | 'practice'
  | 'summer_school';

export const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  research: '科研项目',
  club: '校内社团',
  personal_project: '个人项目',
  internship: '实习',
  practice: '实践活动',
  summer_school: '夏校',
};

export const ACTIVITY_CATEGORY_COLORS: Record<ActivityCategory, string> = {
  research: 'bg-purple-100 text-purple-700',
  club: 'bg-blue-100 text-blue-700',
  personal_project: 'bg-amber-100 text-amber-700',
  internship: 'bg-green-100 text-green-700',
  practice: 'bg-teal-100 text-teal-700',
  summer_school: 'bg-rose-100 text-rose-700',
};

export interface SummerSchool {
  id: string;
  name: string;
  university: string;
  description: string;
  url: string;
  deadline?: string;
  cost?: string;
  duration?: string;
  major: string;
}

export interface Activity {
  id: string;
  number: number;
  category: ActivityCategory;
  name: string;
  description: string;
  outcome?: string;
  summerSchool?: SummerSchool;
}

// ─── 时间规划 ─────────────────────────────────────────────────

export interface TimelineEntry {
  grade: string;          // e.g., "10年级"
  month: string;          // e.g., "9月"
  academic: string;
  schoolActivities: string;
  competitions: string;
  research: string;
  extracurricular: string;
  applicationPrep: string;
}

// ─── 方案 ────────────────────────────────────────────────────

export interface Plan {
  id: string;
  studentId: string;
  status: PlanStatus;
  currentStep: PlanStep;
  createdAt: string;
  updatedAt: string;
  // Generation results
  generationOptions?: GenerationOptions;
  selectedPT?: PTOption;
  selectedPGs?: PGOption[];
  activities?: Activity[];
  timeline?: TimelineEntry[];
  // Advisor notes
  notes?: string;
}

// ─── 设置 ────────────────────────────────────────────────────

export interface AppSettings {
  claudeApiKey?: string;
  organizationName?: string;
  advisorName?: string;
  useMockData?: boolean;
}

// ─── 状态标签映射 ─────────────────────────────────────────────

export const PLAN_STATUS_LABELS: Record<PlanStatus, string> = {
  draft: '草稿',
  generating: 'AI生成中',
  pending_review: '待审核',
  completed: '已完成',
};

export const PLAN_STATUS_COLORS: Record<PlanStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  generating: 'bg-blue-100 text-blue-600',
  pending_review: 'bg-amber-100 text-amber-600',
  completed: 'bg-green-100 text-green-700',
};

// ─── 表单选项常量 ─────────────────────────────────────────────

export const SUBJECT_OPTIONS = [
  '数学', '物理', '化学', '生物', '历史', '地理',
  '经济', '心理学', '计算机科学', '英语文学', '中文',
  '艺术/美术', '音乐', '体育', '戏剧', '哲学',
];

export const COUNTRY_OPTIONS = [
  '美国', '英国', '加拿大', '澳大利亚',
  '香港', '新加坡', '日本', '其他',
];

export const MBTI_OPTIONS = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];
