import type { Student, PTOption, PGOption, Activity } from '@/types';

// ─── PT & PG 生成 Prompt ──────────────────────────────────────

export function buildPTAndPGPrompt(student: Student): string {
  return `你是一位资深留学咨询顾问，专注于国际高中生活动规划。请基于以下学生信息，生成 Personal Tag（PT）和 Personal Goal（PG）。

## 学生背景
- 姓名：${student.chineseName}（${student.englishName}）
- 年级：${student.grade}年级
- 学校：${student.school}（${student.curriculum}体系）
- GPA：${student.gpa}
- 标化目标：${student.testGoals || '未提供'}
- MBTI：${student.mbti || '未提供'}
- 喜欢的科目：${student.favoriteSubjects.join('、')}
- 兴趣爱好：${student.hobbies}
- 好奇心/关注领域：${student.curiosity}
- 已有活动：${student.existingActivities || '暂无'}
- 父母背景：${student.parentBackground || '未提供'}
- 专业方向（2-3个）：${student.majors.join('、')}
- 目标国家：${student.targetCountries.join('、')}

## PT（Personal Tag）生成要求
- PT 是与专业无关的个人特色标签，作为活动主线和主文书素材来源
- 必须具体生动，能一句话让人记住这个学生
- 好的示例："冰球队长"、"书法绘画+文创设计"、"旅行摄影+极光爱好"、"胶卷摄影+大提琴"
- 坏的示例："全面发展的学生"、"热爱学习的人"（过于泛泛）
- 请生成 3 个备选 PT，每个附 2-3 句话描述（说明这个 Tag 的独特性和与学生的契合度）

## PG（Personal Goal）生成要求
- PG 是与专业相关的个人目标，回答"为什么要学这个专业"
- 范围适中：不能太宽泛（如"改善世界"），也不能太具体成为一个实验课题
- 必须结合学生的好奇心和个人经历推导，而非泛泛而谈
- 好的示例："通过材料化学研究，探索可食用/可降解包装材料的开发，提升食品安全与环保可持续性"
- 为每个专业方向分别生成 1 个 PG，附上推导理由（说明为什么这个 PG 适合该学生）

## 输出格式（严格按以下 JSON 格式输出，不要有其他内容）
{
  "ptOptions": [
    {
      "id": "pt_1",
      "tag": "标签文字",
      "description": "2-3句描述说明"
    },
    {
      "id": "pt_2",
      "tag": "标签文字",
      "description": "2-3句描述说明"
    },
    {
      "id": "pt_3",
      "tag": "标签文字",
      "description": "2-3句描述说明"
    }
  ],
  "pgOptions": [
    {
      "id": "pg_1",
      "major": "专业名称",
      "goal": "个人目标陈述（1-2句话，具体且适中）",
      "rationale": "为何适合该学生的推导说明（1-2句话）"
    }
  ]
}`;
}

// ─── 活动方案生成 Prompt ──────────────────────────────────────

export function buildActivityPrompt(
  student: Student,
  selectedPT: PTOption,
  selectedPGs: PGOption[]
): string {
  const pgText = selectedPGs
    .map((pg) => `  - ${pg.major}：${pg.goal}`)
    .join('\n');

  return `你是一位资深留学咨询顾问，请基于以下信息，为学生设计 10 项课外活动规划。

## 学生信息
- 姓名：${student.chineseName}（${student.englishName}）
- 年级：${student.grade}年级 | 学校：${student.school}（${student.curriculum}）
- GPA：${student.gpa}
- 兴趣爱好：${student.hobbies}
- 好奇心/关注领域：${student.curiosity}
- 已有活动：${student.existingActivities || '暂无'}
- 父母背景：${student.parentBackground || '未提供'}
- 专业方向：${student.majors.join('、')}
- 目标国家：${student.targetCountries.join('、')}

## 已确认的 PT 和 PG
**PT（个人特色标签）**：${selectedPT.tag}
${selectedPT.description}

**PG（个人目标）**：
${pgText}

## 活动设计规则（严格遵守以下所有规则）

### 科研项目 × 2
- 课题①：必须直接围绕 PG 主题，产出为学术论文
- 课题②：必须是 PG 的延伸、PG×PT 的交叉，或跨专业视角，产出为论文+项目成果

### 校内社团 × 2
- 社团①：专业相关社团（化学社、机器人社、编程社等）
- 社团②：兴趣类社团（体现 PT，如艺术、音乐、体育等）
- 两个社团都要明确争取 Leader 或 Core Member 角色

### 个人项目 × 1
- 必须体现 PT × PG 的交叉点
- 成果形式多样化（App、网站、作品集、展览、绘本、品牌等）

### 实习 × 1-2
- 必须对应真实存在的行业和公司场景（国内外均可）
- 安排在暑假期间，与专业方向直接相关

### 实践活动 × 1-2
- 至少 1 项：专业特长×公益（志愿服务性质）
- 可选 1 项：行业深度实践（专业性强的调研或项目）

### 夏校 × 1
- 选择专业相关且当前仍在运营的高声望项目（知名大学或机构主办）
- 优先考虑：RSI@MIT、Pioneer Research、Johns Hopkins CTY、UC Berkeley ATDP 等
- 提供完整的夏校信息（官网、费用、时长、申请截止日期）

## 输出格式（严格按以下 JSON 格式输出，共 10 项活动）
{
  "activities": [
    {
      "id": "act_1",
      "number": 1,
      "category": "research",
      "name": "活动名称",
      "description": "详细描述（包括内容、执行方式、时间安排思路、预期深度）",
      "outcome": "预期产出成果"
    },
    {
      "id": "act_9",
      "number": 9,
      "category": "summer_school",
      "name": "夏校名称",
      "description": "申请建议和准备策略",
      "outcome": "预期收获",
      "summerSchool": {
        "id": "ss_1",
        "name": "项目全名",
        "university": "主办机构",
        "description": "项目详细介绍",
        "url": "官网链接",
        "deadline": "申请截止时间",
        "cost": "费用",
        "duration": "时长",
        "major": "对应专业方向"
      }
    }
  ]
}

注意：category 值只能是以下之一：research / club / personal_project / internship / practice / summer_school`;
}

// ─── 时间规划生成 Prompt ──────────────────────────────────────

export function buildTimelinePrompt(
  student: Student,
  activities: Activity[]
): string {
  const activitiesSummary = activities
    .map((a) => `  ${a.number}. [${a.category}] ${a.name}`)
    .join('\n');

  // Calculate grades to cover
  const startGrade = parseInt(student.grade);
  const gradeRange = [];
  for (let g = startGrade; g <= 12; g++) {
    gradeRange.push(`${g}年级`);
  }

  return `你是一位资深留学咨询顾问，请基于学生信息和已规划的活动，生成详细的时间规划。

## 学生信息
- 当前年级：${student.grade}年级
- 专业方向：${student.majors.join('、')}
- 目标国家：${student.targetCountries.join('、')}

## 已规划的 10 项活动
${activitiesSummary}

## 时间规划原则
1. 学期中（9月-次年1月，2月-6月）：优先安排校内活动和竞赛，科研保持低强度推进
2. 暑假（7月-8月）：集中安排实习、夏校、科研高强度阶段
3. 科研项目按"选题→文献→实验/研究→论文写作→投稿"节奏分阶段排布
4. 重要考试（SAT/托福/IB/AP考试）前后需留出备考时间
5. 12年级上学期（9月-12月）：集中申请材料，活动基本进入收尾阶段
6. 每个月的内容应具体，提到具体活动名称

## 需要覆盖的年级范围
${gradeRange.join('、')}（每个年级生成 9月-次年6月共 9-10 个月的条目）

## 输出格式（严格按 JSON 格式，每个月一条记录）
{
  "timeline": [
    {
      "grade": "10年级",
      "month": "9月",
      "academic": "学术相关安排（课程、考试、GPA冲刺等）",
      "schoolActivities": "校内社团活动安排",
      "competitions": "竞赛相关（如有）",
      "research": "科研项目进展",
      "extracurricular": "校外实践/实习/个人项目",
      "applicationPrep": "申请准备相关（如有）"
    }
  ]
}

注意：
- 没有安排的列请留空字符串 ""，不要填"无"或"/"
- 每条记录必须包含 grade 和 month 字段
- 每个字段内容控制在 20 字以内，只写关键词和动作，不要写长句
- 内容要具体，提到实际活动名称，不要过于笼统`;
}
