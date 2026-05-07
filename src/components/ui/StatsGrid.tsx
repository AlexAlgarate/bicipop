import type { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  value: number;
}

interface StatsGridProps {
  stats: StatItem[];
}

export const StatsGrid = ({ stats }: StatsGridProps) => (
  <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map(({ label, icon: Icon, iconColor, bgColor, value }) => (
      <div key={label} className="card flex items-center gap-4">
        <div className={`rounded-full ${bgColor} p-3`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted">{label}</p>
        </div>
      </div>
    ))}
  </div>
);
