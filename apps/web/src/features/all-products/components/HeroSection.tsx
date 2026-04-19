import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className="relative bg-zinc-900 text-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 grayscale"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Dale una segunda vida <br /> a tu bicicleta.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            El marketplace especializado para ciclistas. Compra y vende carretera, MTB,
            gravel y componentes con total confianza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products/create"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-bold transition-transform active:scale-95 text-center"
            >
              Vender mi bici
            </Link>
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-full font-bold transition-all text-center"
            >
              Ver bicicletas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
