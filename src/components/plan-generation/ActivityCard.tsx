'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Activity } from '@/types';
import { ActivityCategoryBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Edit2, RefreshCw, ExternalLink, Check, X } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onUpdate: (updated: Activity) => void;
  onRegenerate: () => void;
  onViewSummerSchool?: () => void;
  regenerating?: boolean;
}

export default function ActivityCard({
  activity,
  onUpdate,
  onRegenerate,
  onViewSummerSchool,
  regenerating,
}: ActivityCardProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(activity.name);
  const [editDesc, setEditDesc] = useState(activity.description);
  const [editOutcome, setEditOutcome] = useState(activity.outcome || '');

  const handleSave = () => {
    onUpdate({ ...activity, name: editName, description: editDesc, outcome: editOutcome });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditName(activity.name);
    setEditDesc(activity.description);
    setEditOutcome(activity.outcome || '');
    setEditing(false);
  };

  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-200 p-5 transition-shadow',
      regenerating && 'opacity-60',
      !regenerating && 'hover:shadow-sm'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-bold text-gray-200 leading-none w-8 shrink-0">
            {String(activity.number).padStart(2, '0')}
          </span>
          <ActivityCategoryBadge category={activity.category} />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {activity.summerSchool && onViewSummerSchool && (
            <Button variant="ghost" size="sm" onClick={onViewSummerSchool}>
              <ExternalLink size={13} />
              夏校详情
            </Button>
          )}
          {!editing && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)} disabled={regenerating}>
                <Edit2 size={13} />
                编辑
              </Button>
              <Button variant="ghost" size="sm" onClick={onRegenerate} loading={regenerating}>
                <RefreshCw size={13} />
                重新生成
              </Button>
            </>
          )}
          {editing && (
            <>
              <Button variant="primary" size="sm" onClick={handleSave}>
                <Check size={13} />
                保存
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X size={13} />
                取消
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">活动名称</label>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">详细描述</label>
            <textarea
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent resize-y"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">产出成果</label>
            <input
              value={editOutcome}
              onChange={e => setEditOutcome(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">{activity.name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{activity.description}</p>
          {activity.outcome && (
            <div className="flex items-start gap-1.5 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500 shrink-0 mt-0.5">产出成果：</span>
              <span className="text-xs text-gray-700">{activity.outcome}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
