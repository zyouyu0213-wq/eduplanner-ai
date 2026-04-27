'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, FileText, Clock, CheckCircle, ArrowRight, Plus } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { PlanStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { StudentStorage, PlanStorage, getRecentPlans } from '@/lib/storage';
import { formatDate, getPlanStepUrl } from '@/lib/utils';
import type { Plan, Student } from '@/types';

interface RecentPlanItem {
  plan: Plan;
  student: Student | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalStudents: 0, totalPlans: 0, pendingReview: 0, completed: 0 });
  const [recentPlans, setRecentPlans] = useState<RecentPlanItem[]>([]);

  useEffect(() => {
    const students = StudentStorage.getAll();
    const plans = PlanStorage.getAll();
    setStats({
      totalStudents: students.length,
      totalPlans: plans.length,
      pendingReview: plans.filter(p => p.status === 'pending_review').length,
      completed: plans.filter(p => p.status === 'completed').length,
    });
    setRecentPlans(getRecentPlans(6));
  }, []);

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
          <p className="text-gray-500 text-sm mt-1">管理学生方案，追踪生成进度</p>
        </div>
        <Link href="/new-plan">
          <Button size="lg">
            <Plus size={16} />
            新建方案
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="学生总数" value={stats.totalStudents} icon={Users} />
        <StatsCard title="方案总数" value={stats.totalPlans} icon={FileText} />
        <StatsCard title="待审核" value={stats.pendingReview} icon={Clock} accent={stats.pendingReview > 0} />
        <StatsCard title="已完成" value={stats.completed} icon={CheckCircle} />
      </div>

      {/* Recent Plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">最近方案</h2>
          <Link href="/students" className="text-sm text-accent hover:text-accent-hover font-medium flex items-center gap-1">
            查看全部 <ArrowRight size={14} />
          </Link>
        </div>

        {recentPlans.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">还没有方案</p>
            <p className="text-gray-400 text-sm mt-1">点击「新建方案」开始为学生创建规划</p>
            <Link href="/new-plan" className="mt-4 inline-block">
              <Button size="sm">
                <Plus size={14} />
                新建第一个方案
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentPlans.map(({ plan, student }) => (
              <Link
                key={plan.id}
                href={getPlanStepUrl(plan)}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {student?.chineseName || '未知学生'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {student?.englishName} · {student?.grade}年级
                    </p>
                  </div>
                  <PlanStatusBadge status={plan.status} />
                </div>
                {student?.majors && student.majors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {student.majors.map(m => (
                      <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(plan.updatedAt)}
                  </span>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-accent transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
