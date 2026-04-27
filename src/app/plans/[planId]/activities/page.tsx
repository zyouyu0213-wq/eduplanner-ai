'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AILoadingCard } from '@/components/ui/LoadingSpinner';
import ActivityCard from '@/components/plan-generation/ActivityCard';
import SummerSchoolDrawer from '@/components/plan-generation/SummerSchoolDrawer';
import Button from '@/components/ui/Button';
import { StudentStorage, PlanStorage } from '@/lib/storage';
import { generateActivities, regenerateActivity } from '@/lib/claude-api';
import type { Student, Plan, Activity, SummerSchool } from '@/types';
import { ACTIVITY_CATEGORY_LABELS } from '@/types';

export default function ActivitiesPage() {
  const { planId } = useParams<{ planId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [drawerSchool, setDrawerSchool] = useState<SummerSchool | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const p = PlanStorage.getById(planId);
    if (!p) { router.push('/'); return; }
    setPlan(p);
    const s = StudentStorage.getById(p.studentId);
    if (!s) { router.push('/'); return; }
    setStudent(s);

    if (!p.selectedPT || !p.selectedPGs) {
      router.push(`/plans/${planId}/pt-pg`);
      return;
    }

    if (p.activities && p.activities.length > 0) {
      setActivities(p.activities);
      setLoading(false);
      return;
    }

    PlanStorage.update(planId, { status: 'generating' });
    generateActivities(s, p.selectedPT, p.selectedPGs).then(acts => {
      setActivities(acts);
      PlanStorage.update(planId, { activities: acts, status: 'pending_review', currentStep: 'activity_review' });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [planId, router]);

  const handleUpdate = (updated: Activity) => {
    const newList = activities.map(a => a.id === updated.id ? updated : a);
    setActivities(newList);
    PlanStorage.update(planId, { activities: newList });
  };

  const handleRegenerate = async (activity: Activity) => {
    if (!student || !plan?.selectedPT || !plan?.selectedPGs) return;
    setRegeneratingId(activity.id);
    try {
      const idx = activities.findIndex(a => a.id === activity.id);
      const newAct = await regenerateActivity(student, plan.selectedPT, plan.selectedPGs, idx, activities);
      const newList = activities.map(a => a.id === activity.id ? { ...newAct, id: activity.id, number: activity.number } : a);
      setActivities(newList);
      PlanStorage.update(planId, { activities: newList });
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleConfirm = async () => {
    setSaving(true);
    PlanStorage.update(planId, { activities, currentStep: 'timeline_generation' });
    router.push(`/plans/${planId}/timeline`);
  };

  // Group by category for display
  const grouped = activities.reduce((acc: Record<string, Activity[]>, act) => {
    const label = ACTIVITY_CATEGORY_LABELS[act.category] || act.category;
    if (!acc[label]) acc[label] = [];
    acc[label].push(act);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <AILoadingCard
          title="AI 正在设计活动方案..."
          steps={['读取 PT & PG 信息', '设计科研项目（2项）', '规划社团与个人项目', '匹配实习与夏校资源']}
          currentStep={2}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/plans/${planId}/pt-pg`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16} /> 上一步
        </Link>
        <div className="text-sm text-gray-500">{student?.chineseName} · 步骤 2/3</div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">活动规划方案</h1>
        <p className="text-gray-500 text-sm mt-1">共 10 项活动，可逐项编辑或重新生成</p>
      </div>

      {/* PT/PG reminder */}
      {plan?.selectedPT && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-amber-600 font-medium text-xs">PT </span>
              <span className="text-gray-800 font-semibold">{plan.selectedPT.tag}</span>
            </div>
            {plan.selectedPGs?.map(pg => (
              <div key={pg.id}>
                <span className="text-amber-600 font-medium text-xs">{pg.major} </span>
                <span className="text-gray-700 text-xs">{pg.goal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities grouped by category */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, acts]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{category}</h3>
            <div className="space-y-3">
              {acts.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onUpdate={handleUpdate}
                  onRegenerate={() => handleRegenerate(activity)}
                  onViewSummerSchool={activity.summerSchool ? () => setDrawerSchool(activity.summerSchool!) : undefined}
                  regenerating={regeneratingId === activity.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <Link href={`/plans/${planId}/pt-pg`}>
          <Button variant="secondary"><ChevronLeft size={16} /> 修改 PT/PG</Button>
        </Link>
        <Button onClick={handleConfirm} loading={saving} size="lg">
          确认并生成时间规划 <ChevronRight size={16} />
        </Button>
      </div>

      <SummerSchoolDrawer school={drawerSchool} onClose={() => setDrawerSchool(null)} />
    </div>
  );
}
