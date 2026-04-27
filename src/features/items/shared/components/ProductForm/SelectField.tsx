import { FIELD_STYLE } from './field-style';
import { FieldError } from './FieldError';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  htmlFor: string;
  error?: string[];
  children: React.ReactNode;
}

export const SelectField = ({
  label,
  htmlFor,
  error,
  children,
  className,
  ...props
}: SelectFieldProps) => (
  <div className="space-y-1">
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {label}
    </label>

    <div className="relative">
      <select
        id={htmlFor}
        className={[
          FIELD_STYLE.base,
          error ? FIELD_STYLE.error : FIELD_STYLE.normal,
          className ?? '',
        ]
          .join(' ')
          .trim()}
        {...props}
      >
        {children}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          className="h-4 w-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <FieldError error={error} />
  </div>
);
