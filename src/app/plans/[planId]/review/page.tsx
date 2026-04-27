'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Download, Edit2, Check, X } from 'lucide-react';
import { PlanStatusBadge, ActivityCategoryBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { StudentStorage, PlanStorage } from '@/lib/storage';
import type { Student, Plan } from '@/types';
import { getCurriculumLabel, getGradeLabel } from '@/lib/utils';

export default function ReviewPage() {
  const { planId } = useParams<{ planId: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const p = PlanStorage.getById(planId);
    if (!p) { router.push('/'); return; }
    setPlan(p);
    setNotes(p.notes || '');
    const s = StudentStorage.getById(p.studentId);
    if (s) setStudent(s);
  }, [planId, router]);

  const handleMarkComplete = () => {
    PlanStorage.update(planId, { status: 'completed', currentStep: 'export' });
    setPlan(prev => prev ? { ...prev, status: 'completed' } : prev);
  };

  const handleSaveNotes = () => {
    PlanStorage.update(planId, { notes });
    setEditingNotes(false);
  };

  if (!plan || !student) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/plans/${planId}/timeline`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16} /> 返回时间规划
        </Link>
        <div className="flex items-center gap-3">
          <PlanStatusBadge status={plan.status} />
          {plan.status !== 'completed' && (
            <Button variant="secondary" size="sm" onClick={handleMarkComplete}>
              <Check size={14} /> 标记为已完成
            </Button>
          )}
          <Link href={`/plans/${planId}/export`}>
            <Button size="sm">
              <Download size={14} /> 导出方案
            </Button>
          </Link>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">方案审核总览</h1>

      {/* Student Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">学生信息</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400">姓名</p>
            <p className="font-semibold text-gray-900">{student.chineseName}</p>
            <p className="text-sm text-gray-500">{student.englishName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">年级 / 学校</p>
            <p className="font-medium text-gray-800">{getGradeLabel(student.grade)}</p>
            <p className="text-sm text-gray-500">{student.school}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">课程 / GPA</p>
            <p className="font-medium text-gray-800">{getCurriculumLabel(student.curriculum)}</p>
            <p className="text-sm text-gray-500">{student.gpa}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">专业方向</p>
            {student.majors.map(m => (
              <p key={m} className="text-sm text-gray-800 font-medium">{m}</p>
            ))}
          </div>
        </div>
      </div>

      {/* PT */}
      {plan.selectedPT && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Personal Tag</h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏷️</span>
            <span className="text-xl font-bold text-gray-900">{plan.selectedPT.tag}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{plan.selectedPT.description}</p>
        </div>
      )}

      {/* PGs */}
      {plan.selectedPGs && plan.selectedPGs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Personal Goals</h2>
          <div className="space-y-3">
            {plan.selectedPGs.map(pg => (
              <div key={pg.id} className="border-l-2 border-accent pl-4">
                <p className="text-xs font-semibold text-accent mb-1">{pg.major}</p>
                <p className="text-sm text-gray-800 leading-relaxed">{pg.goal}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {plan.activities && plan.activities.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">活动规划（10项）</h2>
            <Link href={`/plans/${planId}/activities`} className="text-xs text-accent hover:text-accent-hover flex items-center gap-1">
              <Edit2 size={12} /> 修改活动
            </Link>
          </div>
          <div className="space-y-3">
            {plan.activities.map(act => (
              <div key={act.id} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                <span className="text-lg font-bold text-gray-200 w-8 shrink-0 text-right">
                  {String(act.number).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ActivityCategoryBadge category={act.category} />
                    <span className="font-medium text-gray-900 text-sm">{act.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{act.description}</p>
                  {act.outcome && (
                    <p className="text-xs text-gray-400 mt-1">📎 {act.outcome}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline preview */}
      {plan.timeline && plan.timeline.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">时间规划</h2>
            <Link href={`/plans/${planId}/timeline`} className="text-xs text-accent hover:text-accent-hover flex items-center gap-1">
              <Edit2 size={12} /> 修改时间规划
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            共 {plan.timeline.length} 个月的详细规划（{plan.timeline[0]?.grade} → {plan.timeline[plan.timeline.length - 1]?.grade}）
          </p>
        </div>
      )}

      {/* Advisor notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">顾问备注（内部）</h2>
          {!editingNotes ? (
            <button onClick={() => setEditingNotes(true)} className="text-xs text-accent hover:text-accent-hover flex items-center gap-1">
              <Edit2 size={12} /> 编辑
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSaveNotes} className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"><Check size={12} /> 保存</button>
              <button onClick={() => { setEditingNotes(false); setNotes(plan.notes || ''); }} className="text-xs text-gray-500 flex items-center gap-1"><X size={12} /> 取消</button>
            </div>
          )}
        </div>
        {editingNotes ? (
          <textarea
            autoFocus
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
            placeholder="添加顾问内部备注（不会出现在导出文件中）…"
          />
        ) : (
          <p className="text-sm text-gray-600">{notes || <span className="text-gray-400 italic">暂无备注</span>}</p>
        )}
      </div>

      {/* Export button */}
      <div className="flex justify-center">
        <Link href={`/plans/${planId}/export`}>
          <Button size="lg">
            <Download size={16} /> 导出 Excel + Word 方案文件
          </Button>
        </Link>
      </div>
    </div>
  );
}
