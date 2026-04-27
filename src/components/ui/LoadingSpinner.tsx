import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeMap = { sm: 16, md: 24, lg: 32 };
  return (
    <div className={cn('flex items-center gap-2 text-gray-500', className)}>
      <Loader2 className="animate-spin text-accent" size={sizeMap[size]} />
      {text && <span className="text-sm">{text}</span>}
    </div>
  );
}

interface AILoadingCardProps {
  title?: string;
  steps?: string[];
  currentStep?: number;
}

export function AILoadingCard({
  title = 'AI 正在生成方案...',
  steps = [],
  currentStep = 0,
}: AILoadingCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
          <Loader2 className="animate-spin text-accent" size={24} />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">请稍候，AI 正在分析学生信息并生成个性化方案</p>
      </div>
      {steps.length > 0 && (
        <div className="text-left space-y-2 max-w-sm mx-auto">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-2 text-sm',
                idx < currentStep && 'text-green-600',
                idx === currentStep && 'text-accent font-medium',
                idx > currentStep && 'text-gray-400'
              )}
            >
              {idx < currentStep ? (
                <span className="text-green-500">✓</span>
              ) : idx === currentStep ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block" />
              )}
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LoadingSpinner;
