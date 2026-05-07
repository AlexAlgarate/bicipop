import { Package, TrendingUp, Clock } from 'lucide-react';

import type { DashboardData } from '@/features/profile/dashboard/types';
import { StatsGrid } from '@/components/ui/StatsGrid';

interface DashboardStatsProps {
  statusCounts: DashboardData['statusCounts'];
  totalCount: number;
}
export const DashboardStats = ({ statusCounts, totalCount }: DashboardStatsProps) => {
  const stats = [
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

  return <StatsGrid stats={stats} />;
};
