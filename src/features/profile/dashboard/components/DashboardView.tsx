import { Pagination } from '@/components/ui/Pagination';
import { BackToPageLink } from '@/components/ui/BackToPageLink';
import type { DashboardData } from '@/features/profile/dashboard/types';

import { DashboardStats } from './DashboardStats';
import { DashboardProductPanel } from './DashboardProductPanel';
import { DashboardHeader } from './DashboardHeader';

interface DashboardViewProps {
  username: string;
  data: DashboardData;
  currentPage: number;
  pageSize: number;
}

export const DashboardView = ({
  username,
  data,
  currentPage,
  pageSize,
}: DashboardViewProps) => {
  const totalPages = Math.ceil(data.totalCount / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToPageLink forceHome />

      <DashboardHeader username={username} />

      <DashboardStats statusCounts={data.statusCounts} totalCount={data.totalCount} />
      <DashboardProductPanel products={data.items} />

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};
