import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BiciPop',
  description: 'Página de compraventa de bicicletas de segunda mano.',
};

export default function Home() {
  return (
    <div className="min-h-[calc(75vh-64px)] flex items-center justify-center">
      <h1 className="text-4xl font-bold text-foreground">Bienvenido a BiciPop</h1>
    </div>
  );
}