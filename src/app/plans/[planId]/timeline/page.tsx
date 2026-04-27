'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { AILoadingCard } from '@/components/ui/LoadingSpinner';
import TimelineTable from '@/components/plan-generation/TimelineTable';
import Button from '@/components/ui/Button';
import { StudentStorage, PlanStorage } from '@/lib/storage';
import { generateTimeline } from '@/lib/claude-api';
import type { Student, Plan, TimelineEntry } from '@/types';

export default function TimelinePage() {
  const { planId } = useParams<{ planId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [, setPlan] = useState<Plan | null>(null);
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const p = PlanStorage.getById(planId);
    if (!p) { router.push('/'); return; }
    setPlan(p);
    const s = StudentStorage.getById(p.studentId);
    if (!s) { router.push('/'); return; }
    setStudent(s);

    if (!p.activities || p.activities.length === 0) {
      router.push(`/plans/${planId}/activities`);
      return;
    }

    if (p.timeline && p.timeline.length > 0) {
      setEntries(p.timeline);
      setLoading(false);
      return;
    }

    PlanStorage.update(planId, { status: 'generating' });
    generateTimeline(s, p.activities).then(timeline => {
      setEntries(timeline);
      PlanStorage.update(planId, { timeline, status: 'pending_review', currentStep: 'timeline_review' });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [planId, router]);

  const handleUpdate = (updated: TimelineEntry[]) => {
    setEntries(updated);
    PlanStorage.update(planId, { timeline: updated });
  };

  const handleConfirm = async () => {
    setSaving(true);
    PlanStorage.update(planId, { timeline: entries, currentStep: 'review', status: 'pending_review' });
    router.push(`/plans/${planId}/review`);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <AILoadingCard
          title="AI 正在生成时间规划..."
          steps={['分析活动强度分布', '排布学期与假期节奏', '生成月度详细计划']}
          currentStep={1}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/plans/${planId}/activities`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16} /> 上一步
        </Link>
        <div className="text-sm text-gray-500">{student?.chineseName} · 步骤 3/3</div>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">月度时间规划</h1>
        <p className="text-gray-500 text-sm mt-1">点击任意单元格可直接编辑，拖动右侧滚动条查看更多列</p>
      </div>

      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 mb-5 text-sm text-blue-700">
        <Info size={14} className="shrink-0" />
        <span>时间规划从 {student?.grade} 年级到 12 年级。点击单元格进入编辑，失焦自动保存。</span>
      </div>

      <TimelineTable entries={entries} onUpdate={handleUpdate} />

      <div className="flex justify-between mt-6">
        <Link href={`/plans/${planId}/activities`}>
          <Button variant="secondary"><ChevronLeft size={16} /> 修改活动方案</Button>
        </Link>
        <Button onClick={handleConfirm} loading={saving} size="lg">
          完成审核，查看总览 <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
