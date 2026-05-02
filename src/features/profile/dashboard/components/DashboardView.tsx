import type { UserDTO } from '@/domain/user/types';
import { Pagination } from '@/components/Pagination';

import type { DashboardData } from '../types';

import { DashboardStats } from './DashboardStats';
import { DashboardProductPanel } from './DashboardProductPanel';
import { DashboardHeader } from './DashboardHeader';

interface DashboardViewProps {
  user: UserDTO;
  data: DashboardData;
  currentPage: number;
  pageSize: number;
}

export const DashboardView = ({
  user,
  data,
  currentPage,
  pageSize,
}: DashboardViewProps) => {
  const totalPages = Math.ceil(data.totalCount / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />

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
