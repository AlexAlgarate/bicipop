import Link from 'next/link';

export const LogoSection = () => {
  return (
    <Link
      href="/"
      className="text-2xl font-bold text-foreground flex items-center gap-2"
    >
      <div
        className="w-12 h-12 bg-primary rounded-full flex items-center
        justify-center text-primary-foreground font-bold hover:scale-105
        transition-transform duration-200"
      >
        <span>B</span>
      </div>
      <span className="hidden text-2xl sm:inline-block">BiciPop</span>
    </Link>
  );
};
