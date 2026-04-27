import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS = [
  { num: 1, label: '基本信息' },
  { num: 2, label: '学术背景' },
  { num: 3, label: '兴趣与经历' },
  { num: 4, label: '专业方向' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const done = currentStep > step.num;
        const active = currentStep === step.num;
        return (
          <div key={step.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                done && 'bg-accent text-white',
                active && 'bg-accent text-white ring-4 ring-accent/20',
                !done && !active && 'bg-gray-200 text-gray-500'
              )}>
                {done ? <Check size={14} /> : step.num}
              </div>
              <span className={cn(
                'text-xs whitespace-nowrap',
                active ? 'text-accent font-medium' : done ? 'text-gray-600' : 'text-gray-400'
              )}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mb-5 mx-1',
                currentStep > step.num ? 'bg-accent' : 'bg-gray-200'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
