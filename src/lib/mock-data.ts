// ============================================================
// EduPlanner AI - Mock 数据（基于 5 个真实学生案例）
// 用于开发阶段模拟 AI 生成结果
// ============================================================

import type {
  Student,
  PTOption,
  PGOption,
  GenerationOptions,
  Activity,
  TimelineEntry,
} from '@/types';

// ─── Mock 学生数据（彭婉婷案例）────────────────────────────

export const MOCK_STUDENT: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> = {
  chineseName: '彭婉婷',
  englishName: 'Wanting Peng',
  gender: 'female',
  grade: '10',
  school: '上海美国学校',
  curriculum: 'AP',
  gpa: '3.8/4.0',
  testGoals: 'SAT 1500+, TOEFL 105+',
  mbti: 'INFJ',
  favoriteSubjects: ['化学', '艺术/美术', '生物', '英语文学'],
  hobbies: '书法、中国画、文创设计、陶艺、香水调制',
  curiosity: '对可持续材料和环保包装很感兴趣，想了解化学如何解决环境问题。也很好奇传统工艺材料（如陶瓷釉料）背后的化学原理。',
  existingActivities: '学校化学社成员，参与过校内艺术展，自学香水调制半年',
  parentBackground: '父亲是建筑师，母亲是平面设计师',
  majors: ['化学工程', '材料化学'],
  targetCountries: ['美国', '英国'],
};

// ─── PT 备选方案（3个）──────────────────────────────────────

export const MOCK_PT_OPTIONS: PTOption[] = [
  {
    id: 'pt_1',
    tag: '书法绘画 × 文创设计师',
    description:
      '将传统中国书法与现代文创设计相结合，用艺术表达对可持续美学的追求。这一标签能连接你的化学工程志向与独特的艺术背景，让人看到一个有深度、有温度的未来工程师——她不只会做实验，还能用书法墨迹设计环保包装的视觉语言。',
  },
  {
    id: 'pt_2',
    tag: '传统工艺 × 材料创新者',
    description:
      '从中国传统陶艺和书法中汲取灵感，探索材料的可能性。你对材料质感和工艺的感知力，将成为材料科学研究的独特切入点——当别人在实验室分析数据时，你已经用手感知过釉料的流动与纸张的纤维。这个标签兼具文化深度与学术潜力。',
  },
  {
    id: 'pt_3',
    tag: '香水调香师 × 化学探索者',
    description:
      '用鼻子理解有机化学——这是你独特的切入方式。半年的香水自学经历不只是爱好，而是对分子结构、挥发性和感官体验的直觉性探索。这个标签原创且令人印象深刻，能将艺术敏感度与化学逻辑融为一体，成为申请文书的有力核心。',
  },
];

// ─── PG 备选方案（每个专业一个）────────────────────────────

export const MOCK_PG_OPTIONS: PGOption[] = [
  {
    id: 'pg_1',
    major: '化学工程',
    goal:
      '通过材料化学研究，探索可食用/可降解包装材料的开发，在提升食品安全的同时推动包装行业的环保转型',
    rationale:
      '结合你对可持续材料的好奇心和文创设计背景，这个方向让化学工程研究有了具体的社会价值落点——你不只是在做实验，而是在用化学解决你真正关心的环境问题。',
  },
  {
    id: 'pg_2',
    major: '材料化学',
    goal:
      '探索传统工艺材料（陶瓷釉料、宣纸纤维）的微观化学结构，研究将古代工艺智慧应用于现代功能性生物材料开发的路径',
    rationale:
      '你的陶艺和书法实践为材料研究提供了旁人难以复制的感性基础。这个方向既原创又可行，将艺术与科学深度融合，在申请文书中能形成强烈共鸣，也符合顶尖大学材料系的研究方向。',
  },
];

export const MOCK_GENERATION_OPTIONS: GenerationOptions = {
  ptOptions: MOCK_PT_OPTIONS,
  pgOptions: MOCK_PG_OPTIONS,
};

// ─── 10 项活动方案────────────────────────────────────────────

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act_1',
    number: 1,
    category: 'research',
    name: '可降解包装材料的合成与性能优化研究',
    description:
      '以 PG 为核心课题，研究聚乳酸（PLA）和聚羟基烷酸酯（PHA）等生物基高分子材料的合成工艺，分析其力学性能、降解速率与食品接触安全性之间的关系。通过系统文献综述、小规模实验设计和数据分析，完成一篇面向 Regeneron ISEF 或 Siemens 竞赛的研究论文。建议在 10 年级暑假联系大学教授或中科院材料所寻求指导，以 11 年级上学期完成初稿为目标。',
    outcome: '学术论文（目标投稿至青少年科研期刊或参加 ISEF 竞赛）',
  },
  {
    id: 'act_2',
    number: 2,
    category: 'research',
    name: '宋代陶瓷釉料化学成分的现代材料学分析',
    description:
      'PT × PG 交叉课题：利用 X 射线荧光（XRF）或扫描电子显微镜（SEM）技术，分析宋代汝窑、钧窑等代表性釉料的化学成分，提取其中的硅酸盐网络结构特征，探索古代工艺配方与现代功能涂层材料的潜在关联性。结合你的陶艺实践经验，尝试复现 1-2 种釉料配方并进行性能测试。这个选题原创性极高，兼具人文与科学价值，适合作为申请文书的核心故事。',
    outcome: '研究报告 + 陶艺实验作品系列 + 可能的博物馆/文化机构合作经历',
  },
  {
    id: 'act_3',
    number: 3,
    category: 'club',
    name: '学校化学社 — 绿色材料研究小组负责人',
    description:
      '在现有化学社基础上，发起"绿色材料与可持续化学"研究方向小组，组织每月一次的文献分享、小型实验演示和行业讲座邀请。争取在 11 年级担任 Chemistry Society President 或 Research Director 职位。可组织全校范围的环保材料设计挑战赛，提升社团影响力并为个人项目积累受众群体。',
    outcome: '社团领导身份（Leader/President）+ 校内活动记录 + 指导低年级成员经历',
  },
  {
    id: 'act_4',
    number: 4,
    category: 'club',
    name: '文创艺术社 — 创始人',
    description:
      'PT 的直接体现：创立一个将传统中国书法、水墨画与现代文创设计相结合的跨学科艺术社团。定期举办主题创作工作坊（如"自然材料×东方美学"系列），每学期举办一次校内展览。社团也可作为个人文创品牌项目的宣传和受众积累渠道，形成"社团→品牌→展览"的完整生态链。',
    outcome: '社团创始人身份 + 展览记录 + 媒体报道（校报/本地媒体）',
  },
  {
    id: 'act_5',
    number: 5,
    category: 'personal_project',
    name: '可持续文创品牌「纸间」— 环保材料 × 传统美学',
    description:
      'PT × PG 核心个人项目：创建一个小型文创品牌，产品使用可降解或环保材料（再生纸、大豆油墨、植物染色剂），设计融入书法和水墨元素（如书签、日记本、香氛蜡烛包装）。建立小红书/Instagram 账号，记录从材料研究到产品设计的全过程，将科学探索与艺术创作融为一体。品牌故事直接连接 PG（可降解材料）和 PT（书法文创），是申请文书的天然素材库。',
    outcome: '品牌账号（目标 1000+ 粉丝）+ 实际产品系列 + 销售记录 + 用户反馈',
  },
  {
    id: 'act_6',
    number: 6,
    category: 'internship',
    name: '环保包装材料公司研发/市场部门实习',
    description:
      '利用 11 年级暑假，在一家环保包装材料公司（国内可选择：绿赛可、永新股份、晨光生物；国际可选择：Tetra Pak、Amcor 可持续部门）进行为期 4-6 周的实习，参与新材料性能测试、可持续供应链调研或产品设计改进项目。此实习将把你的科研理解转化为真实商业场景中的应用体验，也能获得宝贵的推荐信。',
    outcome: '实习证明 + 行业认知 + 导师推荐信',
  },
  {
    id: 'act_7',
    number: 7,
    category: 'practice',
    name: '社区垃圾分类与可持续包装科普项目',
    description:
      '专业特长 × 公益方向：设计并执行一个面向社区居民的垃圾分类科普项目，制作兼具信息清晰度与书法美学的材料分类图谱（将科学知识与艺术设计融合）。在 3-5 个居委会或学校进行宣传推广，记录覆盖人数和活动成效。可联合文创社成员共同制作宣传材料，兼顾社团活动与公益实践的双重价值。',
    outcome: '项目报告（参与人数/覆盖社区）+ 环保设计作品集 + 可能的媒体报道',
  },
  {
    id: 'act_8',
    number: 8,
    category: 'practice',
    name: '博物馆/文化机构文创产品设计志愿者',
    description:
      '与上海博物馆、中国文化遗产研究院或本地文创机构合作，以志愿者/实习生身份参与文物衍生品或展览周边的设计工作。这个经历将 PT（传统文化+设计）与专业（材料的文化属性）深度结合，同时积累博物馆行业人脉，为陶瓷研究课题的访谈调研提供便利。',
    outcome: '志愿者证书 + 设计作品集 + 行业导师人脉 + 可能的联名设计经历',
  },
  {
    id: 'act_9',
    number: 9,
    category: 'summer_school',
    name: 'Johns Hopkins CTY — Chemistry or Materials Science',
    description:
      '申请 Johns Hopkins 大学天才青少年中心（CTY）的化学或材料科学方向暑期课程。CTY 是全球最具声望的高中生学术项目之一，课程由大学教授直接授课，强度高、学术氛围浓厚，完成后可获得正式学分证书。申请需要提交 SAT/ACT 分数（或等效学术评估），建议在 10 年级末提前准备申请材料。',
    outcome: '大学学分证书 + 教授推荐信 + 全球同龄学术精英社交圈',
    summerSchool: {
      id: 'ss_1',
      name: 'Johns Hopkins CTY Summer Programs',
      university: 'Johns Hopkins University',
      description:
        '面向天才青少年的顶级暑期学术项目，提供 Chemistry、Intensive Studies 等多个理工方向课程。由大学教授授课，可获得正式学分，在全球高中生中享有极高声誉。',
      url: 'https://cty.jhu.edu/programs/summer/',
      deadline: '每年 2-3 月（具体视课程）',
      cost: '约 $5,000-$8,000（含食宿）',
      duration: '3 周',
      major: '化学工程',
    },
  },
  {
    id: 'act_10',
    number: 10,
    category: 'summer_school',
    name: '备选：MIT Beaver Works Summer Institute (BWSI)',
    description:
      'MIT Lincoln Laboratory 主办的全球顶级理工科高中生暑期项目，提供 Materials Science、Chemical Engineering 等方向，完全免费。课程结合理论与工程实践，最终产出真实的工程项目成果。录取竞争激烈，建议同步申请作为备选，与 CTY 形成互补。',
    outcome: '工程项目成果 + MIT 导师推荐信 + 研究经历',
    summerSchool: {
      id: 'ss_2',
      name: 'MIT Beaver Works Summer Institute (BWSI)',
      university: 'MIT Lincoln Laboratory',
      description:
        'MIT 林肯实验室主办，面向优秀高中生的免费理工科暑期项目。强调工程实践与团队协作，完成真实工程挑战，每年录取约 200 名学生，竞争激烈。',
      url: 'https://beaverworks.ll.mit.edu/CMS/bw/bwsi',
      deadline: '每年 3 月',
      cost: '免费（提供食宿）',
      duration: '4 周（线上预学 + 线下）',
      major: '化学工程',
    },
  },
];

// ─── 时间规划（10年级 → 12年级）────────────────────────────

export const MOCK_TIMELINE: TimelineEntry[] = [
  // 10年级
  {
    grade: '10年级',
    month: '9月',
    academic: 'AP Chemistry 开学冲刺，确立目标5分；建立学习档案习惯',
    schoolActivities: '加入化学社；启动文创艺术社筹备，招募成员',
    competitions: '',
    research: '开始文献阅读：可降解包装材料方向（每周2篇）',
    extracurricular: '「纸间」品牌概念设计；开设小红书账号',
    applicationPrep: '建立活动档案文件夹；记录每次活动照片和反思',
  },
  {
    grade: '10年级',
    month: '10月',
    academic: 'AP Chemistry 第一次单元测试；开始备考 SAT 词汇',
    schoolActivities: '文创艺术社正式成立，举办第一次工作坊',
    competitions: '了解 Regeneron STS 申请规则和时间线',
    research: '确定科研课题①方向：PLA/PHA 降解材料；联系导师',
    extracurricular: '「纸间」第一批产品小批量试制',
    applicationPrep: '',
  },
  {
    grade: '10年级',
    month: '11月',
    academic: 'AP 期中考试备考；英语写作能力提升（文书基础）',
    schoolActivities: '化学社绿色材料小组成立，担任负责人',
    competitions: '',
    research: '科研课题①：完成文献综述初稿（15篇核心文献）',
    extracurricular: '「纸间」产品上线小红书，开始积累粉丝',
    applicationPrep: '',
  },
  {
    grade: '10年级',
    month: '12月',
    academic: 'AP 期末考前冲刺；期末成绩保持',
    schoolActivities: '文创艺术社年末展览筹备',
    competitions: '',
    research: '科研课题①：实验方案设计完成；联系材料实验室',
    extracurricular: '博物馆志愿者申请投递',
    applicationPrep: '',
  },
  {
    grade: '10年级',
    month: '1月',
    academic: 'AP 期末考试；开始 SAT 备考（基础阶段）',
    schoolActivities: '文创艺术社年末展览（PT 核心展示时机）',
    competitions: '',
    research: '科研课题①：开始实验执行阶段（第一轮）',
    extracurricular: '博物馆志愿者面试',
    applicationPrep: '收集标化考试信息；初步了解目标学校',
  },
  {
    grade: '10年级',
    month: '2月',
    academic: '新学期开始；SAT 备考持续',
    schoolActivities: '化学社春季活动策划；申请 VP/President 候选',
    competitions: '初步了解 Siemens 竞赛要求',
    research: '科研课题①：数据分析阶段；联系导师审阅实验结果',
    extracurricular: '博物馆志愿者正式开始（每月2次）',
    applicationPrep: '',
  },
  {
    grade: '10年级',
    month: '3月',
    academic: 'AP 考试备考冲刺阶段开始',
    schoolActivities: '化学社春季讲座邀请行业嘉宾',
    competitions: '',
    research: '科研课题①：论文初稿写作开始',
    extracurricular: '「纸间」春季新品发布；CTY 申请准备',
    applicationPrep: 'CTY 申请材料准备（推荐信、成绩单）',
  },
  {
    grade: '10年级',
    month: '4月',
    academic: 'AP 考试备考冲刺',
    schoolActivities: '化学社绿色材料展览策划',
    competitions: '',
    research: '科研课题①：论文修改完善',
    extracurricular: '博物馆文创设计项目参与',
    applicationPrep: 'CTY 申请提交；开始物色暑期实习机会',
  },
  {
    grade: '10年级',
    month: '5月',
    academic: 'AP 考试（Chemistry 目标5分）',
    schoolActivities: '',
    competitions: '',
    research: '科研课题②选题确定：陶瓷釉料化学分析',
    extracurricular: '确认暑期实习/夏校安排',
    applicationPrep: '暑期计划最终确认',
  },
  {
    grade: '10年级',
    month: '6月',
    academic: '学期末成绩维护；暑假备考 SAT',
    schoolActivities: '',
    competitions: '',
    research: '科研课题②：文献调研和博物馆陶瓷样品联系',
    extracurricular: '「纸间」暑期特别系列策划',
    applicationPrep: '',
  },
  {
    grade: '10年级',
    month: '7月',
    academic: 'SAT 暑期强化；CTY 项目参加',
    schoolActivities: '',
    competitions: '',
    research: '科研课题②：XRF 测试样品准备和分析',
    extracurricular: '环保包装公司实习（4-6周）',
    applicationPrep: '',
  },
  {
    grade: '10年级',
    month: '8月',
    academic: 'SAT 模拟考试；暑假尾声查漏补缺',
    schoolActivities: '',
    competitions: '',
    research: '科研课题②：数据整理；科研课题①投稿准备',
    extracurricular: '实习总结报告；「纸间」秋季新品设计',
    applicationPrep: '整理暑期活动档案和成果',
  },
  // 11年级
  {
    grade: '11年级',
    month: '9月',
    academic: 'SAT 第一次正式考试；AP 课程新学期（Biology/Math等）',
    schoolActivities: '竞选化学社 President；文创艺术社秋季展览策划',
    competitions: 'Siemens 竞赛项目注册',
    research: '科研课题②：论文写作阶段；科研课题①根据反馈修改',
    extracurricular: '社区环保科普项目启动',
    applicationPrep: '开始研究 Common App 结构',
  },
  {
    grade: '11年级',
    month: '10月',
    academic: 'SAT 第二次考试（如需提分）；AP 课程深入',
    schoolActivities: '化学社秋季绿色材料展览举办',
    competitions: 'Siemens 竞赛材料提交准备',
    research: '科研课题②：论文定稿；联系导师审阅',
    extracurricular: '社区项目进行中（3个社区完成）',
    applicationPrep: '',
  },
  {
    grade: '11年级',
    month: '11月',
    academic: '托福首次备考；期中考试',
    schoolActivities: '文创艺术社秋季展览（年度最大展览）',
    competitions: 'Siemens 竞赛初赛提交',
    research: '科研课题②投稿；开始思考第三个科研方向（可选）',
    extracurricular: '「纸间」品牌周年总结；博物馆项目成果展示',
    applicationPrep: '初步构思主文书方向（与文书老师沟通）',
  },
  {
    grade: '11年级',
    month: '12月',
    academic: '期末考试冲刺',
    schoolActivities: '年末活动总结',
    competitions: '',
    research: '科研课题①②成果整理归档',
    extracurricular: '实习/实践项目收尾',
    applicationPrep: '开始收集推荐信计划（确定推荐人）',
  },
  {
    grade: '11年级',
    month: '1月',
    academic: '托福考试；期末成绩',
    schoolActivities: '春季学期社团规划',
    competitions: 'Regeneron STS 申请提交',
    research: '新课题探索（如有意向）',
    extracurricular: '博物馆春季项目',
    applicationPrep: '暑期科研/夏校申请开始（BWSI等）',
  },
  {
    grade: '11年级',
    month: '2月',
    academic: '托福/SAT 复考准备',
    schoolActivities: '化学社春季实验展示活动',
    competitions: 'Regeneron STS 结果等待',
    research: '',
    extracurricular: '「纸间」春季系列上线',
    applicationPrep: '推荐人确认；征集推荐信写作材料',
  },
  {
    grade: '11年级',
    month: '3月',
    academic: 'AP 备考冲刺',
    schoolActivities: '',
    competitions: '',
    research: '',
    extracurricular: 'BWSI 申请提交',
    applicationPrep: '主文书初稿动笔；夏季科研项目申请',
  },
  {
    grade: '11年级',
    month: '4月',
    academic: 'AP 备考最后冲刺',
    schoolActivities: '文创艺术社春季展览',
    competitions: '',
    research: '',
    extracurricular: '确认暑期安排（夏校/科研/实习）',
    applicationPrep: '主文书修改；活动列表初稿完成',
  },
  {
    grade: '11年级',
    month: '5月',
    academic: 'AP 考试（目标 Chemistry 5分，其他课程 4-5分）',
    schoolActivities: '',
    competitions: '',
    research: '',
    extracurricular: '',
    applicationPrep: '暑期申请材料汇总',
  },
  {
    grade: '11年级',
    month: '6月',
    academic: '托福最终冲刺（目标 105+）',
    schoolActivities: '',
    competitions: '',
    research: '',
    extracurricular: '毕业晚会/校内活动',
    applicationPrep: '申请文书暑期修改计划制定',
  },
  {
    grade: '11年级',
    month: '7月',
    academic: '托福考试',
    schoolActivities: '',
    competitions: '',
    research: 'BWSI 或导师科研项目（暑期密集阶段）',
    extracurricular: '博物馆暑期合作项目',
    applicationPrep: '主文书定稿；补充文书起草',
  },
  {
    grade: '11年级',
    month: '8月',
    academic: '标化成绩确认；查漏补缺',
    schoolActivities: '',
    competitions: '',
    research: '科研项目收尾；成果整理',
    extracurricular: '「纸间」年度总结报告',
    applicationPrep: 'Common App 表格填写；活动列表最终版',
  },
  // 12年级
  {
    grade: '12年级',
    month: '9月',
    academic: '学术成绩最终维护（Senior Year GPA 至关重要）',
    schoolActivities: '化学社顾问角色交接给接任者',
    competitions: '',
    research: '科研成果最终整理',
    extracurricular: '「纸间」品牌交棒计划',
    applicationPrep: 'EA/ED 申请文书定稿；10月1日 Common App 开放后立即提交',
  },
  {
    grade: '12年级',
    month: '10月',
    academic: '期中考试；保持成绩',
    schoolActivities: '社团年度大展（作为毕业前最后一次）',
    competitions: '',
    research: '',
    extracurricular: '',
    applicationPrep: 'EA/ED 申请提交（10月/11月截止）；推荐信催收',
  },
  {
    grade: '12年级',
    month: '11月',
    academic: '',
    schoolActivities: '',
    competitions: '',
    research: '',
    extracurricular: '',
    applicationPrep: 'EA/ED 截止日期冲刺；RD 申请文书完善',
  },
  {
    grade: '12年级',
    month: '12月',
    academic: '期末考试',
    schoolActivities: '',
    competitions: '',
    research: '',
    extracurricular: '',
    applicationPrep: 'RD 申请批量提交（1月1日截止学校）；等待 ED 结果',
  },
  {
    grade: '12年级',
    month: '1月',
    academic: '期末成绩报告',
    schoolActivities: '',
    competitions: '',
    research: '',
    extracurricular: '',
    applicationPrep: 'RD 申请全部提交；开始等待',
  },
];

// ─── 其他学生案例（用于工作台展示）────────────────────────

export const MOCK_STUDENTS_LIST = [
  {
    id: 'student_demo_1',
    chineseName: '许業恒',
    englishName: 'Yeheng Xu',
    grade: '10' as const,
    school: '深圳国际预科学院',
    curriculum: 'IB' as const,
    majors: ['建筑学'],
    status: 'pending_review' as const,
    updatedAt: '2026-03-07',
  },
  {
    id: 'student_demo_2',
    chineseName: '刘盈含',
    englishName: 'Yinghan Liu',
    grade: '11' as const,
    school: '北京汇佳职业学院附属学校',
    curriculum: 'AP' as const,
    majors: ['动物科学', '生物学'],
    status: 'generating' as const,
    updatedAt: '2026-03-08',
  },
  {
    id: 'student_demo_3',
    chineseName: '彭婉婷',
    englishName: 'Wanting Peng',
    grade: '10' as const,
    school: '上海美国学校',
    curriculum: 'AP' as const,
    majors: ['化学工程', '材料化学'],
    status: 'completed' as const,
    updatedAt: '2026-03-06',
  },
  {
    id: 'student_demo_4',
    chineseName: '陈锦坤',
    englishName: 'Jinkun Chen',
    grade: '10' as const,
    school: '广州美国人国际学校',
    curriculum: 'AP' as const,
    majors: ['应用数学', '统计学'],
    status: 'draft' as const,
    updatedAt: '2026-03-05',
  },
];

// ─── Few-shot 案例（供 Prompt 使用）──────────────────────────

export const FEW_SHOT_EXAMPLES = [
  {
    student: '彭婉婷（AP, 10年级, 化学工程/材料化学）',
    pt: '书法绘画 + 文创设计',
    pg: '通过材料化学研究，探索可食用/可降解包装材料的开发，提升食品安全与环保可持续性',
    keyActivity: '可持续文创品牌「纸间」+ 陶瓷釉料化学研究',
  },
  {
    student: '许業恒（IB, 10年级, 建筑学）',
    pt: '冰球队长',
    pg: '研究历史建筑保护与城市更新的平衡，探索旧建筑改造与社区功能复兴的路径',
    keyActivity: '流浪动物安置点建筑设计 + 冰球社 Captain',
  },
  {
    student: '刘盈含（AP, 11年级, 动物科学/生态学）',
    pt: '胶卷摄影 + 大提琴',
    pg: '探索城市化进程中流浪动物的生态位变化，研究基于行为学的城市动物保护干预策略',
    keyActivity: '水母艺术展（PT×PG 交叉）+ 动物行为学科研',
  },
  {
    student: '虞哲（AP, 11年级, 传媒/创业学）',
    pt: '嘴哈音乐',
    pg: '探索音乐作为社会议题传播媒介的力量，研究青年文化内容如何推动非营利品牌认知',
    keyActivity: '非营利组织主题歌曲创作 + 传媒公司实习',
  },
  {
    student: '陈锦坤（AP, 10年级, 应用数学/体育分析）',
    pt: '旅行摄影 + 极光爱好',
    pg: '运用数学建模和数据分析方法，探索极光预测模型与体育赛事数据分析的共同底层逻辑',
    keyActivity: '校队档案管理数据系统 + 极光概率预测模型',
  },
];
