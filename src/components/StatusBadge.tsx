import type { ItemStatus, ReviewStatus, VersionStatus, MaterialNecessity } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ItemStatus | ReviewStatus | VersionStatus | MaterialNecessity | string;
  type?: 'item' | 'review' | 'version' | 'material';
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: '草稿', className: 'bg-slate-100 text-slate-600' },
  reviewing: { label: '审核中', className: 'bg-amber-100 text-amber-700' },
  returned: { label: '已退回', className: 'bg-red-100 text-red-600' },
  published: { label: '已发布', className: 'bg-green-100 text-green-700' },
  archived: { label: '已归档', className: 'bg-slate-100 text-slate-500' },
  pending: { label: '待处理', className: 'bg-amber-100 text-amber-700' },
  approved: { label: '已通过', className: 'bg-green-100 text-green-700' },
  rejected: { label: '已拒绝', className: 'bg-red-100 text-red-600' },
  superseded: { label: '已失效', className: 'bg-slate-100 text-slate-500' },
  required: { label: '必需', className: 'bg-red-100 text-red-600' },
  optional: { label: '可选', className: 'bg-slate-100 text-slate-600' },
  conditional: { label: '容缺受理', className: 'bg-amber-100 text-amber-700' },
  national: { label: '国家标准', className: 'bg-purple-100 text-purple-700' },
  provincial: { label: '省级标准', className: 'bg-blue-100 text-blue-700' },
  municipal: { label: '市级标准', className: 'bg-teal-100 text-teal-700' },
  county: { label: '县级标准', className: 'bg-green-100 text-green-700' },
};

export default function StatusBadge({
  status,
  type = 'item',
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-slate-100 text-slate-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

export function StandardBadge({ source }: { source: string }) {
  const config = statusConfig[source] || {
    label: source,
    className: 'bg-slate-100 text-slate-600',
  };

  return (
    <span
      className={cn(
      'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
      config.className
    )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {config.label}
    </span>
  );
}
