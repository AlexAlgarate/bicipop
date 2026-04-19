import { BackToHomeLink } from '@/components/BackToHomeLink';

interface Props {
  children: React.ReactNode;
}

export const ProductDetailView = ({ children }: Props) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <BackToHomeLink />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">{children}</div>
    </div>
  );
};
