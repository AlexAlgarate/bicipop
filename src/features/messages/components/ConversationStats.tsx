import { MessageCircle, MailOpen, ShoppingBag, Tag } from 'lucide-react';

import { StatsGrid } from '@/components/ui/StatsGrid';

interface MessagesStatsProps {
  total: number;
  unread: number;
  asBuyer: number;
  asSeller: number;
}

export const ConversationStats = ({
  total,
  unread,
  asBuyer,
  asSeller,
}: MessagesStatsProps) => {
  const stats = [
    {
      label: 'Total',
      icon: MessageCircle,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
      value: total,
    },
    {
      label: 'Unread',
      icon: MailOpen,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      value: unread,
    },
    {
      label: 'As buyer',
      icon: ShoppingBag,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      value: asBuyer,
    },
    {
      label: 'As seller',
      icon: Tag,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      value: asSeller,
    },
  ];

  return <StatsGrid stats={stats} />;
};
