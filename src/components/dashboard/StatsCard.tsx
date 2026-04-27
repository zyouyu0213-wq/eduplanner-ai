import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  accent?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, subtitle, accent }: StatsCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-200 p-5',
      accent && 'border-accent/30 bg-amber-50/50'
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-green-600 mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          accent ? 'bg-accent/15' : 'bg-gray-100'
        )}>
          <Icon size={20} className={accent ? 'text-accent' : 'text-gray-500'} />
        </div>
      </div>
    </div>
  );
}
