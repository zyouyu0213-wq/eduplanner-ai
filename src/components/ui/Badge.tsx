import { cn } from '@/lib/utils';
import type { PlanStatus, ActivityCategory } from '@/types';
import { PLAN_STATUS_LABELS, PLAN_STATUS_COLORS, ACTIVITY_CATEGORY_LABELS, ACTIVITY_CATEGORY_COLORS } from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variant === 'outline' && 'border',
        className
      )}
    >
      {children}
    </span>
  );
}

export function PlanStatusBadge({ status }: { status: PlanStatus }) {
  return (
    <Badge className={PLAN_STATUS_COLORS[status]}>
      {PLAN_STATUS_LABELS[status]}
    </Badge>
  );
}

export function ActivityCategoryBadge({ category }: { category: ActivityCategory }) {
  return (
    <Badge className={cn('text-xs', ACTIVITY_CATEGORY_COLORS[category])}>
      {ACTIVITY_CATEGORY_LABELS[category]}
    </Badge>
  );
}
