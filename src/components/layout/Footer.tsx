import Link from 'next/link';

import {
  LINKEDIN_URL,
  GITHUB_SVG_PATH,
  LINKEDIN_SVG_PATH,
  GITHUB_URL,
} from '@/utils/constants';

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border bg-background">
      <div className="container mx-auto px-4 flex flex-col md:flex-row itmes-center justify-between gap-4">
        <span className="text-muted-foreground text-center md:text-center">
          © {new Date().getFullYear()} — Developed by{' '}
          <Link
            href={LINKEDIN_URL}
            className="font-medium text-foreground hover:text-blue-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Álex Algarate
          </Link>
        </span>
        <div className="flex items-center justify-center gap-4">
          <MediaLink
            url={GITHUB_URL}
            ariaLabel="Github repository"
            hoverClassname="text-foreground"
          >
            <MediaIcon iconTitle="Github" path={GITHUB_SVG_PATH} />
          </MediaLink>
          <MediaLink
            url={LINKEDIN_URL}
            ariaLabel="Linkedin profile"
            hoverClassname="text-[#0077b5]"
          >
            <MediaIcon iconTitle="Linkedin" path={LINKEDIN_SVG_PATH} />
          </MediaLink>
        </div>
      </div>
    </footer>
  );
};

const MediaLink = ({
  url,
  ariaLabel,
  hoverClassname,
  children,
}: {
  url: string;
  ariaLabel: string;
  hoverClassname: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`text-muted-foreground hover:${hoverClassname} hover:-translate-y-0.5 transition-all duration-200`}
    >
      {children}
    </Link>
  );
};

const MediaIcon = ({ iconTitle, path }: { iconTitle: string; path: string }) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
      fill="currentColor"
    >
      <title>{iconTitle}</title>
      <path d={path} />
    </svg>
  );
};
