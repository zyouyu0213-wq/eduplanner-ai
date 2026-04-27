'use client';

import { useState } from 'react';
import type { Student } from '@/types';
import { COUNTRY_OPTIONS } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChevronLeft, Plus, Trash2, Sparkles } from 'lucide-react';

interface StepProps {
  data: Partial<Student>;
  onChange: (updates: Partial<Student>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function Step4ProfessionalDirection({ data, onChange, onBack, onSubmit }: StepProps) {
  const [submitting, setSubmitting] = useState(false);
  const majors = data.majors || ['', ''];
  const countries = data.targetCountries || [];

  const updateMajor = (idx: number, val: string) => {
    const updated = [...majors];
    updated[idx] = val;
    onChange({ majors: updated });
  };

  const addMajor = () => {
    if (majors.length < 3) onChange({ majors: [...majors, ''] });
  };

  const removeMajor = (idx: number) => {
    onChange({ majors: majors.filter((_: string, i: number) => i !== idx) });
  };

  const toggleCountry = (c: string) => {
    const updated = countries.includes(c)
      ? countries.filter((x: string) => x !== c)
      : [...countries, c];
    onChange({ targetCountries: updated });
  };

  const isValid = majors.filter((m: string) => m.trim()).length >= 1 && countries.length > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">专业方向</h2>
      <p className="text-sm text-gray-500 mb-5">输入 2-3 个专业方向（AI 将围绕这些方向生成 PG 和活动方案）</p>
      <div className="space-y-5">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            专业方向 <span className="text-red-500">*</span>
          </label>
          {majors.map((major: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  placeholder={`专业方向 ${idx + 1}，例：${idx === 0 ? '化学工程' : idx === 1 ? '材料化学' : '环境工程'}`}
                  value={major}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMajor(idx, e.target.value)}
                />
              </div>
              {idx >= 2 && (
                <button
                  onClick={() => removeMajor(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          {majors.length < 3 && (
            <button
              type="button"
              onClick={addMajor}
              className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium"
            >
              <Plus size={14} />
              添加第三个专业方向
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            申请国家/方向 <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {COUNTRY_OPTIONS.map((country: string) => (
              <button
                key={country}
                type="button"
                onClick={() => toggleCountry(country)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  countries.includes(country)
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                )}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {isValid && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1.5">
            <p className="text-xs font-semibold text-gray-700 mb-2">✨ 方案将包含</p>
            <p className="text-xs text-gray-600">• PT（个人特色标签）× 3 个备选</p>
            <p className="text-xs text-gray-600">• PG（个人目标）× {majors.filter((m: string) => m.trim()).length} 个，每个专业方向一个</p>
            <p className="text-xs text-gray-600">• 10 项活动规划（科研×2 / 社团×2 / 个人项目×1 / 实习×1-2 / 实践×1-2 / 夏校×1）</p>
            <p className="text-xs text-gray-600">• 月度时间规划表（从当前年级至12年级）</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={onBack} disabled={submitting}>
          <ChevronLeft size={16} /> 上一步
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid} loading={submitting} size="lg">
          <Sparkles size={16} />
          生成规划方案
        </Button>
      </div>
    </div>
  );
}
