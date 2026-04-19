import Link from 'next/link';

interface AuthFooterProps {
  footerText: string;
  href: string;
  linkText: string;
}

export const AuthFooter = ({ footerText, href, linkText }: AuthFooterProps) => {
  return (
    <div className="mt-6 pt-6 border-t border-white/10 text-center">
      <p className="m-0 text-sm sm:text-base text-muted">
        {footerText}{' '}
        <Link
          href={href}
          className="text-primary font-medium underline-offset-4 transition duration-400 hover:text-primary-hover hover:underline"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};
