import { type LucideIcon, Package, TrendingUp, Clock } from 'lucide-react';

import { ProductStatus } from '@/generated/client/enums';
import type { ProductsWithFavoriteStatus } from '@/domain/products/types';

interface StatConfig {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  getValue: (products: ProductsWithFavoriteStatus[]) => number;
}

const STAT_CONFIG: StatConfig[] = [
  {
    label: 'Total Products',
    icon: Package,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
    getValue: products => products.length,
  },
  {
    label: 'Active',
    icon: TrendingUp,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-500/10',
    getValue: products => products.filter(p => p.status === ProductStatus.ACTIVE).length,
  },
  {
    label: 'Reserved',
    icon: Clock,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    getValue: products =>
      products.filter(p => p.status === ProductStatus.RESERVED).length,
  },
  {
    label: 'Sold',
    icon: Package,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    getValue: products => products.filter(p => p.status === ProductStatus.SOLD).length,
  },
];

export const DashboardStats = ({
  products,
}: {
  products: ProductsWithFavoriteStatus[];
}) => (
  <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {STAT_CONFIG.map(({ label, icon: Icon, iconColor, bgColor, getValue }) => (
      <div key={label} className="card flex items-center gap-4">
        <div className={`rounded-full ${bgColor} p-3`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{getValue(products)}</p>
          <p className="text-sm text-muted">{label}</p>
        </div>
      </div>
    ))}
  </div>
);
