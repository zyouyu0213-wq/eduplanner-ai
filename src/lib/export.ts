// ============================================================
// EduPlanner AI - 导出功能
// 生成 Excel (.xlsx) 和 Word (.docx) 方案文件
// PRD 5.4: Excel 4 个 Sheet + Word 信息卡 + 时间规划表
// ============================================================

import type { Student, Plan, Activity, TimelineEntry } from '@/types';
import { ACTIVITY_CATEGORY_LABELS } from '@/types';
import type { Paragraph, Table } from 'docx';

// ─── Excel 导出 ───────────────────────────────────────────────

export async function exportToExcel(student: Student, plan: Plan): Promise<void> {
  const XLSX = await import('xlsx');

  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Activity List ──────────────────────────────────
  const activities: Activity[] = plan.activities || [];

  const activityRows = [
    ['No.', '活动分类', 'Activity', 'Detailed Description', '产出成果'],
    ...activities.map(act => [
      act.number,
      ACTIVITY_CATEGORY_LABELS[act.category] || act.category,
      act.name,
      act.description,
      act.outcome || '',
    ]),
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(activityRows);
  // Column widths
  ws1['!cols'] = [
    { wch: 6 },   // No.
    { wch: 12 },  // 分类
    { wch: 35 },  // Activity
    { wch: 70 },  // Description
    { wch: 35 },  // 产出
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Activity List');

  // ── Sheet 2: Honor（竞赛规划）──────────────────────────────
  const honorRows = [
    ['No.', 'Competition', 'Subject', 'Year', 'Recognition Level', 'Team/Individual'],
    ['1', '待规划', '', `${new Date().getFullYear() + 1}`, '待定', 'Individual'],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(honorRows);
  ws2['!cols'] = [
    { wch: 6 }, { wch: 40 }, { wch: 18 }, { wch: 8 }, { wch: 20 }, { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'Honor');

  // ── Sheet 3: 可参加竞赛介绍 ────────────────────────────────
  const competitionRows = [
    ['竞赛名称', '简介', '内容', '资格', '考试', '时间', '费用', '奖项', '官网'],
    ['Regeneron ISEF', '全美最大科学工程竞赛', `${student.majors[0] || '综合'}方向`, '高中生', '无', '每年5月', '免费', '大奖/类别奖', 'https://www.societyforscience.org/isef/'],
    ['Siemens Competition', '西门子科研竞赛', '数学/科学', '高中生', '无', '每年9-11月', '免费', '奖学金', 'https://www.siemens-foundation.org/'],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(competitionRows);
  ws3['!cols'] = [
    { wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 10 },
    { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 40 },
  ];
  XLSX.utils.book_append_sheet(wb, ws3, '可参加竞赛介绍');

  // ── Sheet 4: 夏校 ──────────────────────────────────────────
  const summerSchools = activities
    .filter(a => a.category === 'summer_school' && a.summerSchool)
    .map(a => a.summerSchool!);

  const summerRows = [
    ['夏校名称', '项目介绍', '线上/线下', '官网', '时长', '适合年级', '截止日期', '申请材料'],
    ...summerSchools.map(ss => [
      ss.name,
      ss.description,
      '线下',
      ss.url,
      ss.duration || '',
      `${student.grade}年级`,
      ss.deadline || '',
      '成绩单、推荐信、个人陈述',
    ]),
  ];
  if (summerRows.length === 1) {
    summerRows.push(['待定', '', '', '', '', '', '', '']);
  }
  const ws4 = XLSX.utils.aoa_to_sheet(summerRows);
  ws4['!cols'] = [
    { wch: 30 }, { wch: 50 }, { wch: 10 }, { wch: 40 },
    { wch: 12 }, { wch: 10 }, { wch: 18 }, { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, ws4, '夏校');

  // ── Write and download ──────────────────────────────────────
  const filename = `${student.chineseName}_${student.englishName}_活动规划方案.xlsx`;
  XLSX.writeFile(wb, filename);
}

// ─── Word 导出 ────────────────────────────────────────────────

export async function exportToWord(student: Student, plan: Plan): Promise<void> {
  const { Document, Packer, Paragraph, Table, TableRow, TableCell,
    TextRun, HeadingLevel, AlignmentType,
    WidthType, ShadingType } = await import('docx');

  const activities: Activity[] = plan.activities || [];
  const timeline: TimelineEntry[] = plan.timeline || [];

  // ── Helper: create header paragraph ───────────────────────
  const heading = (text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel] = HeadingLevel.HEADING_2) =>
    new Paragraph({ text, heading: level, spacing: { before: 240, after: 120 } });

  const para = (text: string, bold = false, size = 22) =>
    new Paragraph({
      children: [new TextRun({ text, bold, size })],
      spacing: { after: 80 },
    });

  // ── Section 1: 学生基础信息卡片 ────────────────────────────
  const infoSection = [
    new Paragraph({
      text: `${student.chineseName}（${student.englishName}）活动规划方案`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    }),

    heading('学生基础信息', HeadingLevel.HEADING_2),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [
          new TableCell({ children: [para('姓名', true)], width: { size: 20, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [para(`${student.chineseName} / ${student.englishName}`)], width: { size: 30, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [para('年级', true)], width: { size: 20, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [para(`${student.grade}年级`)], width: { size: 30, type: WidthType.PERCENTAGE } }),
        ]}),
        new TableRow({ children: [
          new TableCell({ children: [para('学校', true)] }),
          new TableCell({ children: [para(student.school)] }),
          new TableCell({ children: [para('课程体系', true)] }),
          new TableCell({ children: [para(student.curriculum)] }),
        ]}),
        new TableRow({ children: [
          new TableCell({ children: [para('GPA / 排名', true)] }),
          new TableCell({ children: [para(student.gpa)] }),
          new TableCell({ children: [para('MBTI', true)] }),
          new TableCell({ children: [para(student.mbti || '—')] }),
        ]}),
        new TableRow({ children: [
          new TableCell({ children: [para('专业方向', true)] }),
          new TableCell({ children: [para(student.majors.filter(Boolean).join(' / '))], columnSpan: 3 }),
        ]}),
        new TableRow({ children: [
          new TableCell({ children: [para('目标国家', true)] }),
          new TableCell({ children: [para(student.targetCountries.join(' / '))], columnSpan: 3 }),
        ]}),
      ],
    }),
  ];

  // ── Section 2: PT & PG ────────────────────────────────────
  const ptPgSection: (Paragraph | Table)[] = [
    heading('Personal Tag（个人特色标签）'),
    para(plan.selectedPT ? `🏷️ ${plan.selectedPT.tag}` : '待确认', true, 26),
    plan.selectedPT ? para(plan.selectedPT.description) : new Paragraph(''),
    heading('Personal Goals（个人目标）'),
    ...(plan.selectedPGs || []).flatMap(pg => [
      para(`【${pg.major}】`, true),
      para(pg.goal),
      new Paragraph({ spacing: { after: 80 } }),
    ]),
  ];

  // ── Section 3: 活动列表 ────────────────────────────────────
  const activitySection: (Paragraph | Table)[] = [
    heading('活动规划方案（10项）'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        // Header
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ children: [para('No.', true)], width: { size: 5, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.SOLID, color: 'F3F4F6' } }),
            new TableCell({ children: [para('分类', true)], width: { size: 12, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.SOLID, color: 'F3F4F6' } }),
            new TableCell({ children: [para('Activity', true)], width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.SOLID, color: 'F3F4F6' } }),
            new TableCell({ children: [para('Detailed Description', true)], width: { size: 58, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.SOLID, color: 'F3F4F6' } }),
          ],
        }),
        ...activities.map(act =>
          new TableRow({ children: [
            new TableCell({ children: [para(String(act.number).padStart(2, '0'))] }),
            new TableCell({ children: [para(ACTIVITY_CATEGORY_LABELS[act.category] || act.category)] }),
            new TableCell({ children: [para(act.name, true)] }),
            new TableCell({ children: [para(act.description)] }),
          ]}),
        ),
      ],
    }),
  ];

  // ── Section 4: 时间规划表 ──────────────────────────────────
  const timelineHeaders = ['年级', '月份', '学术成绩', '校内活动', '竞赛比赛', '教授科研', '校外实践', '申请准备'];
  const timelineSection: (Paragraph | Table)[] = [
    new Paragraph({ text: '', pageBreakBefore: true }),
    heading('月度时间规划'),
    ...(timeline.length === 0
      ? [para('时间规划待生成')]
      : [new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            // Header row
            new TableRow({
              tableHeader: true,
              children: timelineHeaders.map(h =>
                new TableCell({
                  children: [para(h, true, 18)],
                  shading: { type: ShadingType.SOLID, color: 'FEF3C7' },
                })
              ),
            }),
            // Data rows
            ...timeline.map(entry =>
              new TableRow({ children: [
                new TableCell({ children: [para(entry.grade, false, 18)] }),
                new TableCell({ children: [para(entry.month, false, 18)] }),
                new TableCell({ children: [para(entry.academic, false, 18)] }),
                new TableCell({ children: [para(entry.schoolActivities, false, 18)] }),
                new TableCell({ children: [para(entry.competitions, false, 18)] }),
                new TableCell({ children: [para(entry.research, false, 18)] }),
                new TableCell({ children: [para(entry.extracurricular, false, 18)] }),
                new TableCell({ children: [para(entry.applicationPrep, false, 18)] }),
              ]}),
            ),
          ],
        })]),
  ];

  // ── Assemble document ──────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { size: 22, font: 'Arial' },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children: [
        ...infoSection,
        new Paragraph({ text: '', spacing: { after: 240 } }),
        ...ptPgSection,
        new Paragraph({ text: '', spacing: { after: 240 } }),
        ...activitySection,
        ...timelineSection,
      ],
    }],
  });

  // ── Download ────────────────────────────────────────────────
  const buffer = await Packer.toBlob(doc);
  const url = URL.createObjectURL(buffer);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${student.chineseName}_${student.englishName}_活动规划方案.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
