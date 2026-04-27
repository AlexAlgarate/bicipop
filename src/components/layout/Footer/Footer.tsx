import { GithubIcon } from './GithubIcon';
import { LinkedinIcon } from './LinkedinIcon';

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border bg-background">
      <div className="container mx-auto px-4 flex flex-col md:flex-row itmes-center justify-between gap-4">
        <span className="text-muted-foreground text-center md:text-center">
          © {new Date().getFullYear()} — Developed by{' '}
          <a
            href="https://www.linkedin.com/in/alex-algarate/"
            className="font-medium text-foreground hover:text-blue-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Álex Algarate
          </a>
        </span>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/AlexAlgarate/product-project"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Github repository"
            className="text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition-all duration-200"
          >
            <GithubIcon className="w-7 h-7" />
          </a>
          <a
            href="https://www.linkedin.com/in/alex-algarate/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linkedin profile"
            className="text-muted-foreground hover:text-[#0077b5] hover:-translate-y-0.5 transition-all duration-200"
          >
            <LinkedinIcon className="w-7 h-7" />
          </a>
        </div>
      </div>
    </footer>
  );
};
