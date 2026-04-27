'use client';

import { useState } from 'react';
import { ExternalLink, Clock, DollarSign, GraduationCap, Search } from 'lucide-react';

const SUMMER_SCHOOLS = [
  {
    id: 'ss_rsi',
    name: 'Research Science Institute (RSI)',
    university: 'MIT (CEE主办)',
    category: '顶级科研',
    major: '数理/工程/生命科学',
    description: '全球竞争最激烈的高中生科研项目之一，免费，为期6周，完全在MIT校园进行。学生在大学教授指导下独立完成研究项目并撰写论文。录取率约1%，被称为"高中科研的奥林匹克"。',
    url: 'https://www.cee.org/research-science-institute',
    deadline: '每年1月中旬',
    cost: '免费（提供食宿）',
    duration: '6周',
    grade: '11年级',
    type: '线下',
  },
  {
    id: 'ss_bwsi',
    name: 'Beaver Works Summer Institute (BWSI)',
    university: 'MIT Lincoln Laboratory',
    category: '工程实践',
    major: '计算机/工程/数学',
    description: 'MIT林肯实验室主办，免费的理工科暑期项目。强调工程实践与团队协作，完成真实工程挑战。线上预学4-8周后线下4周。每年约200名学生录取。',
    url: 'https://beaverworks.ll.mit.edu/CMS/bw/bwsi',
    deadline: '每年3月',
    cost: '免费（提供食宿）',
    duration: '线上+线下共约12周',
    grade: '10-11年级',
    type: '混合',
  },
  {
    id: 'ss_cty',
    name: 'Johns Hopkins CTY Summer Programs',
    university: 'Johns Hopkins University',
    category: '学术精英',
    major: '多学科方向',
    description: '面向学术天才青少年的顶级暑期项目，课程由大学教授直接授课，强度高、学术氛围浓厚。可获得正式大学学分。申请需提交SAT/ACT分数或等效学术评估。',
    url: 'https://cty.jhu.edu/programs/summer/',
    deadline: '每年2-3月（各课程不同）',
    cost: '$5,000-$8,000（含食宿）',
    duration: '3周',
    grade: '9-11年级',
    type: '线下',
  },
  {
    id: 'ss_primes',
    name: 'MIT PRIMES-USA',
    university: 'MIT Mathematics Department',
    category: '顶级科研',
    major: '数学/计算机',
    description: '由MIT数学系主办的远程高中生数学研究项目，由MIT教授和研究生直接指导。全年制（9月-5月），完全免费。录取竞争极激烈，通常要求数学竞赛背景（AMC/AIME等）。',
    url: 'https://math.mit.edu/research/highschool/primes/usa/',
    deadline: '每年12月初',
    cost: '免费（远程）',
    duration: '全年制（9月-5月）',
    grade: '10-11年级',
    type: '远程',
  },
  {
    id: 'ss_stanford',
    name: 'Stanford Pre-Collegiate Studies',
    university: 'Stanford University',
    category: '学术精英',
    major: '多学科方向',
    description: '斯坦福大学面向高中生的暑期学术项目，提供大学课程学分。包含线上和线下选项，涵盖STEM、人文、社科等多个方向，适合有明确学术兴趣的学生。',
    url: 'https://summerinstitutes.spcs.stanford.edu/',
    deadline: '每年3-4月',
    cost: '$3,000-$7,000',
    duration: '3-8周（视课程）',
    grade: '9-11年级',
    type: '线下/线上',
  },
  {
    id: 'ss_pioneer',
    name: 'Pioneer Research Program',
    university: 'Pioneer Academics',
    category: '科研导向',
    major: '多学科方向',
    description: '由常青藤大学教授指导的远程研究项目，学生在教授指导下独立完成一篇学术论文，并获得大学学分（部分合作大学）。相比RSI录取难度适中，是获得正规科研经历的好渠道。',
    url: 'https://www.pioneeracademics.com/',
    deadline: '每年2-3月',
    cost: '$3,500-$5,000',
    duration: '9周（远程）',
    grade: '10-11年级',
    type: '远程',
  },
  {
    id: 'ss_sshi',
    name: 'Summer Science & Humanities Institute (SSHI)',
    university: '多所顶尖大学联办',
    category: '跨学科',
    major: '科学/人文交叉',
    description: '面向有跨学科兴趣的高中生，结合科学研究方法与人文批判性思维。适合申请文理交叉专业方向的学生，如认知科学、神经科学、数字人文等方向。',
    url: 'https://sshischolars.org/',
    deadline: '每年4月',
    cost: '$4,000-$6,000',
    duration: '5周',
    grade: '10-11年级',
    type: '线下',
  },
  {
    id: 'ss_harvard',
    name: 'Harvard Pre-College Program',
    university: 'Harvard University',
    category: '名校体验',
    major: '多学科方向',
    description: '哈佛大学官方预科项目，学生在哈佛校园内参加课程、住宿，沉浸式体验顶尖大学生活。课程强度较高，不提供正式学分，但校园体验和社交网络价值极高。',
    url: 'https://www.summer.harvard.edu/high-school-programs/pre-college-program',
    deadline: '每年3月',
    cost: '$5,000-$6,000（含食宿）',
    duration: '2周',
    grade: '10-12年级',
    type: '线下',
  },
];

const CATEGORIES = ['全部', '顶级科研', '工程实践', '学术精英', '科研导向', '名校体验', '跨学科'];

export default function SummerSchoolsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');

  const filtered = SUMMER_SCHOOLS.filter(ss => {
    const matchSearch = !search ||
      ss.name.toLowerCase().includes(search.toLowerCase()) ||
      ss.university.toLowerCase().includes(search.toLowerCase()) ||
      ss.major.includes(search) ||
      ss.description.includes(search);
    const matchCat = category === '全部' || ss.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">夏校数据库</h1>
        <p className="text-gray-500 text-sm mt-1">精选高含金量夏校项目，数据仅供参考，请以官网为准</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索项目名称、大学、专业…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === cat
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5 text-xs text-amber-700">
        ⚠️ 以下信息仅供参考，夏校项目可能随时更新。请顾问在向学生推荐前到官网验证最新的截止日期、费用和招生状态。
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(ss => (
          <div key={ss.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    ss.category === '顶级科研' ? 'bg-purple-100 text-purple-700' :
                    ss.category === '工程实践' ? 'bg-blue-100 text-blue-700' :
                    ss.category === '学术精英' ? 'bg-amber-100 text-amber-700' :
                    ss.category === '科研导向' ? 'bg-teal-100 text-teal-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{ss.category}</span>
                  <span className="text-xs text-gray-400">{ss.type}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-base leading-snug">{ss.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{ss.university}</p>
              </div>
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <GraduationCap size={18} className="text-accent" />
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1">{ss.description}</p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                  <Clock size={11} /> 时长
                </div>
                <div className="text-xs font-medium text-gray-700">{ss.duration}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                  <DollarSign size={11} /> 费用
                </div>
                <div className="text-xs font-medium text-gray-700">{ss.cost}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>适合年级：{ss.grade}</span>
              <span>截止：{ss.deadline}</span>
            </div>

            <a
              href={ss.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-accent hover:text-accent transition-colors"
            >
              <ExternalLink size={12} /> 访问官网
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Search size={32} className="mx-auto mb-3 opacity-40" />
          <p>没有匹配的夏校项目</p>
        </div>
      )}
    </div>
  );
}
