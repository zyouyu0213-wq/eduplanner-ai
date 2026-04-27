'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, RefreshCw, Check } from 'lucide-react';
import { AILoadingCard } from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { StudentStorage, PlanStorage } from '@/lib/storage';
import { generatePTAndPG } from '@/lib/claude-api';
import type { Student, Plan, PTOption, PGOption } from '@/types';

export default function PTPGPage() {
  const { planId } = useParams<{ planId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [, setPlan] = useState<Plan | null>(null);
  const [ptOptions, setPtOptions] = useState<PTOption[]>([]);
  const [pgOptions, setPgOptions] = useState<PGOption[]>([]);
  const [selectedPTId, setSelectedPTId] = useState<string>('');
  const [editedPGs, setEditedPGs] = useState<Record<string, string>>({});
  const [editingPG, setEditingPG] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const p = PlanStorage.getById(planId);
    if (!p) { router.push('/'); return; }
    setPlan(p);
    const s = StudentStorage.getById(p.studentId);
    if (!s) { router.push('/'); return; }
    setStudent(s);

    // If options already generated, show them
    if (p.generationOptions) {
      setPtOptions(p.generationOptions.ptOptions);
      setPgOptions(p.generationOptions.pgOptions);
      if (p.selectedPT) setSelectedPTId(p.selectedPT.id);
      setLoading(false);
      return;
    }

    // Generate
    PlanStorage.update(planId, { status: 'generating' });
    generatePTAndPG(s).then(opts => {
      setPtOptions(opts.ptOptions);
      setPgOptions(opts.pgOptions);
      if (opts.ptOptions.length > 0) setSelectedPTId(opts.ptOptions[0].id);
      PlanStorage.update(planId, {
        generationOptions: opts,
        status: 'pending_review',
        currentStep: 'pt_pg_selection',
      });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [planId, router]);

  const handleRegenerate = () => {
    if (!student) return;
    setLoading(true);
    PlanStorage.update(planId, { generationOptions: undefined, status: 'generating' });
    generatePTAndPG(student).then(opts => {
      setPtOptions(opts.ptOptions);
      setPgOptions(opts.pgOptions);
      if (opts.ptOptions.length > 0) setSelectedPTId(opts.ptOptions[0].id);
      PlanStorage.update(planId, { generationOptions: opts, status: 'pending_review', currentStep: 'pt_pg_selection' });
      setLoading(false);
    });
  };

  const getEditedPG = (pg: PGOption) => editedPGs[pg.id] ?? pg.goal;

  const handleConfirm = async () => {
    setSaving(true);
    const selectedPT = ptOptions.find(p => p.id === selectedPTId);
    if (!selectedPT) return;
    const selectedPGs = pgOptions.map(pg => ({ ...pg, goal: getEditedPG(pg) }));
    PlanStorage.update(planId, {
      selectedPT,
      selectedPGs,
      currentStep: 'activity_generation',
    });
    router.push(`/plans/${planId}/activities`);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <AILoadingCard
          title="AI 正在生成 PT & PG..."
          steps={['分析学生背景信息', '生成 Personal Tag 备选', '生成 Personal Goal 方案']}
          currentStep={1}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16} /> 返回工作台
        </Link>
        <div className="text-sm text-gray-500">
          {student?.chineseName} · 步骤 1/3
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">选择 Personal Tag & Personal Goal</h1>
        <p className="text-gray-500 text-sm mt-1">选择最能代表该学生的标签，并确认或调整专业目标</p>
      </div>

      {/* PT Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">个人特色标签（Personal Tag）</h2>
          <button onClick={handleRegenerate} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent">
            <RefreshCw size={12} /> 重新生成
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-4">选择最能一句话让人记住该学生特色的标签</p>
        <div className="space-y-3">
          {ptOptions.map((pt) => (
            <div
              key={pt.id}
              onClick={() => setSelectedPTId(pt.id)}
              className={cn(
                'rounded-xl border-2 p-4 cursor-pointer transition-all',
                selectedPTId === pt.id
                  ? 'border-accent bg-amber-50/60'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 text-base">🏷️ {pt.tag}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{pt.description}</p>
                </div>
                <div className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                  selectedPTId === pt.id ? 'border-accent bg-accent' : 'border-gray-300'
                )}>
                  {selectedPTId === pt.id && <Check size={12} className="text-white" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PG Section */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-800 mb-1">个人目标（Personal Goal）</h2>
        <p className="text-xs text-gray-500 mb-4">可直接编辑调整目标措辞，点击文字区域进入编辑</p>
        <div className="space-y-4">
          {pgOptions.map((pg) => (
            <div key={pg.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-accent bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {pg.major}
                </span>
              </div>
              {editingPG === pg.id ? (
                <div className="space-y-2">
                  <textarea
                    autoFocus
                    className="w-full px-3 py-2 text-sm rounded-lg border border-accent/40 bg-amber-50/30 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-y"
                    rows={3}
                    value={getEditedPG(pg)}
                    onChange={e => setEditedPGs(prev => ({ ...prev, [pg.id]: e.target.value }))}
                    onBlur={() => setEditingPG(null)}
                  />
                </div>
              ) : (
                <p
                  className="text-sm text-gray-800 leading-relaxed cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                  onClick={() => setEditingPG(pg.id)}
                >
                  {getEditedPG(pg)}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2 italic">💡 {pg.rationale}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Link href="/new-plan">
          <Button variant="secondary"><ChevronLeft size={16} /> 修改学生信息</Button>
        </Link>
        <Button onClick={handleConfirm} disabled={!selectedPTId || saving} loading={saving} size="lg">
          确认并生成活动方案 <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
