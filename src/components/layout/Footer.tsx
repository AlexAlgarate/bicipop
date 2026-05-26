import Link from 'next/link';

import { routes, footerCategories } from '@/config/routes';

const LINKEDIN_URL = 'https://www.linkedin.com/in/alex-algarate/';
const GITHUB_URL = 'https://github.com/AlexAlgarate/';

const LINKEDIN_SVG_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

const GITHUB_SVG_PATH =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';

export const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={`relative mt-auto bg-background ${className ?? ''}`}>
      <div className="absolute top-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent opacity-60" />

      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:gap-16">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-sm">
                <span className="text-lg font-bold text-white">B</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                BiciPop
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Buy and sell second-hand bikes. The easiest way to give a new lease of life
              to bikes you no longer use.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href={routes.home} className="transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={routes.search}
                  className="transition-colors hover:text-primary"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href={routes.products.upload}
                  className="transition-colors hover:text-primary"
                >
                  Sell
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {footerCategories.map(cat => (
                <li key={cat.slug}>
                  <Link
                    href={`${routes.search}?category=${cat.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href={routes.aboutUs}
                  className="transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={routes.termsOfService}
                  className="transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BiciPop. Developed by{' '}
            <Link
              href={LINKEDIN_URL}
              className="font-medium text-foreground transition-colors hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Álex Algarate
            </Link>
          </p>

          <div className="flex items-center gap-5">
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
      className={`text-muted-foreground hover:${hoverClassname} transition-all duration-200 hover:scale-110`}
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
      className="w-5 h-5 sm:w-6 sm:h-6"
      fill="currentColor"
    >
      <title>{iconTitle}</title>
      <path d={path} />
    </svg>
  );
};
