'use client';

import type { Student } from '@/types';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepProps {
  data: Partial<Student>;
  onChange: (updates: Partial<Student>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3InterestsExperience({ data, onChange, onNext, onBack }: StepProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">兴趣与经历</h2>
      <p className="text-sm text-gray-500 mb-5">以下信息选填，但填写越详细，AI 生成的方案质量越高</p>
      <div className="space-y-5">
        <Textarea
          label="已有活动经历"
          placeholder="校内社团、实践项目、比赛等，例如：学校化学社成员，参加过校内艺术展，自学香水调制半年…"
          rows={4}
          value={data.existingActivities || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ existingActivities: e.target.value })}
          hint="AI 会在此基础上规划新活动，避免与已有经历重复"
        />

        <Textarea
          label="父母职业背景"
          placeholder="例如：父亲是建筑师，母亲是平面设计师；或父亲在外企工作，可能有实习资源对接…"
          rows={3}
          value={data.parentBackground || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ parentBackground: e.target.value })}
          hint="可能影响实习资源的对接和个人项目的落地方式"
        />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800 font-medium mb-1">💡 为什么要填这些信息？</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            已有活动经历帮助 AI 避免重复推荐，并在现有基础上升级。父母背景有助于规划更可落地的实习机会。这两项信息不会出现在学生看到的导出文件中。
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={onBack}>
          <ChevronLeft size={16} /> 上一步
        </Button>
        <Button onClick={onNext}>
          下一步 <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
