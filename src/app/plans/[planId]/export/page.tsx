'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Download, FileSpreadsheet, FileText,
  CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { PlanStatusBadge, ActivityCategoryBadge } from '@/components/ui/Badge';
import { StudentStorage, PlanStorage } from '@/lib/storage';
import { exportToExcel, exportToWord } from '@/lib/export';
import { getCurriculumLabel, getGradeLabel } from '@/lib/utils';
import type { Student, Plan } from '@/types';

export default function ExportPage() {
  const { planId } = useParams<{ planId: string }>();
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingWord, setExportingWord] = useState(false);
  const [exportedExcel, setExportedExcel] = useState(false);
  const [exportedWord, setExportedWord] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = PlanStorage.getById(planId);
    if (!p) { router.push('/'); return; }
    setPlan(p);
    const s = StudentStorage.getById(p.studentId);
    if (s) setStudent(s);
  }, [planId, router]);

  const handleExportExcel = async () => {
    if (!student || !plan) return;
    setExportingExcel(true);
    setError(null);
    try {
      await exportToExcel(student, plan);
      setExportedExcel(true);
      PlanStorage.update(planId, { status: 'completed', currentStep: 'export' });
      setPlan(prev => prev ? { ...prev, status: 'completed' } : prev);
    } catch (e) {
      console.error(e);
      setError('Excel 导出失败，请重试');
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportWord = async () => {
    if (!student || !plan) return;
    setExportingWord(true);
    setError(null);
    try {
      await exportToWord(student, plan);
      setExportedWord(true);
      PlanStorage.update(planId, { status: 'completed', currentStep: 'export' });
      setPlan(prev => prev ? { ...prev, status: 'completed' } : prev);
    } catch (e) {
      console.error(e);
      setError('Word 导出失败，请重试');
    } finally {
      setExportingWord(false);
    }
  };

  const handleExportAll = async () => {
    await handleExportExcel();
    await handleExportWord();
  };

  if (!plan || !student) return null;


  return (
    <div className="p-6 max-w-3xl mx-auto no-print">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/plans/${planId}/review`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16} /> 返回审核页
        </Link>
        <PlanStatusBadge status={plan.status} />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">导出方案文件</h1>
        <p className="text-gray-500 text-sm mt-1">
          将生成标准化的 Excel（活动清单）和 Word（完整方案）文件
        </p>
      </div>

      {/* Student summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">
              {student.chineseName}
              <span className="text-gray-400 font-normal text-base ml-2">({student.englishName})</span>
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {getGradeLabel(student.grade)} · {student.school} · {getCurriculumLabel(student.curriculum)}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {student.majors.filter(Boolean).map(m => (
                <span key={m} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  {m}
                </span>
              ))}
            </div>
          </div>
          {plan.selectedPT && (
            <div className="text-right">
              <p className="text-xs text-gray-400">PT</p>
              <p className="text-sm font-semibold text-gray-800">{plan.selectedPT.tag}</p>
            </div>
          )}
        </div>
      </div>

      {/* File checklist */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">方案内容核查</h3>
        <div className="space-y-2.5">
          {[
            { label: 'PT（个人特色标签）', done: !!plan.selectedPT },
            { label: `PG（个人目标 × ${plan.selectedPGs?.length || 0} 个专业）`, done: !!plan.selectedPGs?.length },
            { label: `活动方案（${plan.activities?.length || 0} / 10 项）`, done: (plan.activities?.length || 0) >= 8 },
            { label: `时间规划（${plan.timeline?.length || 0} 个月）`, done: (plan.timeline?.length || 0) > 0 },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2.5">
              {item.done
                ? <CheckCircle size={16} className="text-green-500 shrink-0" />
                : <AlertCircle size={16} className="text-amber-500 shrink-0" />}
              <span className={`text-sm ${item.done ? 'text-gray-700' : 'text-amber-700'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Excel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FileSpreadsheet size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Excel 方案文件</h3>
              <p className="text-xs text-gray-500">.xlsx 格式</p>
            </div>
          </div>
          <ul className="text-xs text-gray-500 space-y-1 mb-4">
            <li>• Sheet 1: Activity List（活动清单）</li>
            <li>• Sheet 2: Honor（竞赛规划）</li>
            <li>• Sheet 3: 可参加竞赛介绍</li>
            <li>• Sheet 4: 夏校推荐</li>
          </ul>
          <Button
            variant={exportedExcel ? 'secondary' : 'primary'}
            className="w-full"
            onClick={handleExportExcel}
            loading={exportingExcel}
            disabled={exportingExcel}
          >
            {exportingExcel ? (
              <><Loader2 size={14} className="animate-spin" /> 生成中…</>
            ) : exportedExcel ? (
              <><CheckCircle size={14} className="text-green-500" /> 已下载</>
            ) : (
              <><Download size={14} /> 下载 Excel</>
            )}
          </Button>
        </div>

        {/* Word */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Word 方案文件</h3>
              <p className="text-xs text-gray-500">.docx 格式</p>
            </div>
          </div>
          <ul className="text-xs text-gray-500 space-y-1 mb-4">
            <li>• 学生基础信息卡片</li>
            <li>• PT & PG 汇总</li>
            <li>• 10 项活动详细描述</li>
            <li>• 月度时间规划表</li>
          </ul>
          <Button
            variant={exportedWord ? 'secondary' : 'primary'}
            className="w-full"
            onClick={handleExportWord}
            loading={exportingWord}
            disabled={exportingWord}
          >
            {exportingWord ? (
              <><Loader2 size={14} className="animate-spin" /> 生成中…</>
            ) : exportedWord ? (
              <><CheckCircle size={14} className="text-green-500" /> 已下载</>
            ) : (
              <><Download size={14} /> 下载 Word</>
            )}
          </Button>
        </div>
      </div>

      {/* One-click export all */}
      {!exportedExcel || !exportedWord ? (
        <Button
          size="lg"
          className="w-full"
          onClick={handleExportAll}
          loading={exportingExcel || exportingWord}
          disabled={exportingExcel || exportingWord}
        >
          <Download size={16} />
          一键下载全部文件（Excel + Word）
        </Button>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <CheckCircle size={20} className="text-green-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-green-800">全部文件已导出完成</p>
          <p className="text-xs text-green-600 mt-1">方案已标记为「已完成」状态</p>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Activities preview */}
      {plan.activities && plan.activities.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">活动清单预览</h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {plan.activities.map((act, idx) => (
              <div key={act.id} className={`flex items-start gap-3 px-5 py-3.5 ${idx < plan.activities!.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <span className="text-sm font-bold text-gray-300 w-6 shrink-0 text-right mt-0.5">
                  {String(act.number).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <ActivityCategoryBadge category={act.category} />
                    <span className="text-sm font-medium text-gray-900 truncate">{act.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{act.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
