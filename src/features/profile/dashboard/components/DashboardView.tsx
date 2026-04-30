import { Plus } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/config/routes';
import type { UserDTO } from '@/domain/user/types';
import { Pagination } from '@/components/Pagination';

import type { DashboardData } from '../types';

import { DashboardStats } from './DashboardStats';
import { DashboardProductPanel } from './DashboardProductPanel';

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

const DashboardHeader = ({ user }: { user: UserDTO }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted">
          Welcome back, {user.username}! Manage your listings here.
        </p>
      </div>
      <Link href={routes.items.upload} className="btn btn-primary gap-2 px-6 py-3">
        <Plus className="h-5 w-5" />
        Upload Product
      </Link>
    </div>
  );
};
