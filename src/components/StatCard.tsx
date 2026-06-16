import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  description?: string;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  className?: string;
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    text: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    text: 'text-green-600',
  },
  amber: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    text: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    text: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    text: 'text-purple-600',
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'blue',
  className,
}: StatCardProps) {
  const colors = colorConfig[color];

  return (
    <div
      className={cn(
        'bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.isUp ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isUp ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.value}%
              </span>
              <span className="text-xs text-slate-400">较上周</span>
            </div>
          )}
          {description && !trend && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              colors.iconBg
            )}
          >
            <Icon className={cn('w-6 h-6', colors.iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}

export function StatCardWithProgress({
  title,
  value,
  total,
  progress,
  color = 'blue',
  icon: Icon,
}: {
  title: string;
  value: number;
  total: number;
  progress: number;
  color?: 'blue' | 'green' | 'amber' | 'red';
  icon?: LucideIcon;
}) {
  const colors = colorConfig[color];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              colors.iconBg
            )}
          >
            <Icon className={cn('w-5 h-5', colors.iconColor)} />
          </div>
        )}
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-xl font-bold text-slate-800">
            {value} / {total}
          </p>
        </div>
      </div>
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn('absolute left-0 top-0 h-full rounded-full transition-all duration-500', {
            'bg-blue-500': color === 'blue',
            'bg-green-500': color === 'green',
            'bg-amber-500': color === 'amber',
            'bg-red-500': color === 'red',
          })}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      <div className="mt-2 flex justify-between text-xs">
        <span className="text-slate-500">完成进度</span>
        <span className="font-medium text-slate-700">{progress.toFixed(1)}%</span>
      </div>
    </div>
  );
}
