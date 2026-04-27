'use client';

import type { Student } from '@/types';
import { SUBJECT_OPTIONS } from '@/types';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepProps {
  data: Partial<Student>;
  onChange: (updates: Partial<Student>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2AcademicBackground({ data, onChange, onNext, onBack }: StepProps) {
  const selectedSubjects = data.favoriteSubjects || [];

  const toggleSubject = (subject: string) => {
    const updated = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s: string) => s !== subject)
      : [...selectedSubjects, subject];
    onChange({ favoriteSubjects: updated });
  };

  const isValid = selectedSubjects.length > 0 && data.hobbies && data.curiosity;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">学术背景</h2>
      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            喜欢的科目 <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500">包括擅长科目和感兴趣科目，可多选</p>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_OPTIONS.map((subject: string) => (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubject(subject)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  selectedSubjects.includes(subject)
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                )}
              >
                {subject}
              </button>
            ))}
          </div>
          {selectedSubjects.length > 0 && (
            <p className="text-xs text-accent">已选 {selectedSubjects.length} 项</p>
          )}
        </div>

        <Textarea
          label="兴趣爱好 / 特长"
          required
          placeholder="请详细描述兴趣爱好和特长，例如：书法、中国画、文创设计、陶艺、香水调制…"
          rows={4}
          value={data.hobbies || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ hobbies: e.target.value })}
          hint="越具体越好，这将直接影响 PT 的生成质量"
        />

        <Textarea
          label="好奇心 / 关注领域"
          required
          placeholder="对什么问题感兴趣？想探索什么方向？例如：对可持续材料和环保包装很感兴趣，想了解化学如何解决环境问题…"
          rows={4}
          value={data.curiosity || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ curiosity: e.target.value })}
          hint="这是生成 PG（个人目标）的核心素材"
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={onBack}>
          <ChevronLeft size={16} /> 上一步
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          下一步 <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
