import type { Metadata } from 'next';

import { HeroSection } from '@/features/all-products/components/HeroSection';

export const metadata: Metadata = {
  title: 'BiciPop',
  description: 'Página de compraventa de bicicletas de segunda mano.',
};

export default function Home() {
  return (
    <div className="pb-20 space-y-12">
      <HeroSection />
    </div>
  );
}
