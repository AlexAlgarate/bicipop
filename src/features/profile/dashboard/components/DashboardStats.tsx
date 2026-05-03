import { Package, TrendingUp, Clock } from 'lucide-react';

import type { DashboardData } from '@/features/profile/dashboard/types';

const STATS_CONFIG = (
  statusCounts: DashboardData['statusCounts'],
  totalCount: number
) => [
  {
    label: 'Total Products',
    icon: Package,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
    value: totalCount,
  },
  {
    label: 'Active',
    icon: TrendingUp,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-500/10',
    value: statusCounts.active,
  },
  {
    label: 'Reserved',
    icon: Clock,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    value: statusCounts.reserved,
  },
  {
    label: 'Sold',
    icon: Package,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    value: statusCounts.sold,
  },
];

export const DashboardStats = ({
  statusCounts,
  totalCount,
}: {
  statusCounts: DashboardData['statusCounts'];
  totalCount: number;
}) => (
  <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {STATS_CONFIG(statusCounts, totalCount).map(
      ({ label, icon: Icon, iconColor, bgColor, value }) => (
        <div key={label} className="card flex items-center gap-4">
          <div className={`rounded-full ${bgColor} p-3`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </div>
        </div>
      )
    )}
  </div>
);
