import Link from 'next/link';

export const LogoSection = () => {
  return (
    <Link
      href="/"
      className="text-2xl font-bold text-foreground flex items-center gap-2"
    >
      <span
        className="w-12 h-12 bg-primary rounded-full flex items-center
        justify-center text-primary-foreground font-bold hover:scale-105
        transition-transform duration-200"
      >
        B
      </span>
      <span>BiciPop</span>
    </Link>
  );
};
