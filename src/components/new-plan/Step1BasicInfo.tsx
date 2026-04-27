'use client';

import type { Student, Curriculum } from '@/types';
import { MBTI_OPTIONS as MBTI_LIST } from '@/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface StepProps {
  data: Partial<Student>;
  onChange: (updates: Partial<Student>) => void;
  onNext: () => void;
}

const GRADE_OPTIONS = [
  { value: '9', label: '9年级' },
  { value: '10', label: '10年级' },
  { value: '11', label: '11年级' },
  { value: '12', label: '12年级' },
];

const CURRICULUM_OPTIONS: { value: Curriculum; label: string }[] = [
  { value: 'IB', label: 'IB' },
  { value: 'AP', label: 'AP' },
  { value: 'A-Level', label: 'A-Level' },
  { value: 'other', label: '其他' },
];

export default function Step1BasicInfo({ data, onChange, onNext }: StepProps) {
  const isValid = data.chineseName && data.englishName && data.gender && data.grade && data.school && data.curriculum && data.gpa;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">基本信息</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="学生中文名"
            required
            placeholder="例：彭婉婷"
            value={data.chineseName || ''}
            onChange={e => onChange({ chineseName: e.target.value })}
          />
          <Input
            label="学生英文名"
            required
            placeholder="例：Wanting Peng"
            value={data.englishName || ''}
            onChange={e => onChange({ englishName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              性别 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[{ value: 'female', label: '女' }, { value: 'male', label: '男' }].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ gender: opt.value as 'male' | 'female' })}
                  className={cn(
                    'flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                    data.gender === opt.value
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Select
            label="当前年级"
            required
            placeholder="请选择"
            options={GRADE_OPTIONS}
            value={data.grade || ''}
            onChange={e => onChange({ grade: e.target.value as Student['grade'] })}
          />
        </div>

        <Input
          label="学校名称"
          required
          placeholder="国际高中名称"
          value={data.school || ''}
          onChange={e => onChange({ school: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              课程体系 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CURRICULUM_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ curriculum: opt.value })}
                  className={cn(
                    'py-2 rounded-lg text-sm font-medium border transition-colors',
                    data.curriculum === opt.value
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="当前 GPA / 排名"
            required
            placeholder="如：3.8/4.0 或 前10%"
            value={data.gpa || ''}
            onChange={e => onChange({ gpa: e.target.value })}
          />
        </div>

        <Input
          label="标化考试目标"
          placeholder="如：SAT 1500+, TOEFL 105+"
          value={data.testGoals || ''}
          onChange={e => onChange({ testGoals: e.target.value })}
          hint="选填"
        />

        <Select
          label="MBTI（选填）"
          placeholder="请选择 MBTI 类型"
          options={MBTI_LIST.map(m => ({ value: m, label: m }))}
          value={data.mbti || ''}
          onChange={e => onChange({ mbti: e.target.value })}
        />
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={onNext} disabled={!isValid}>
          下一步 <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
