import { FieldError } from '@/components/FieldError';
import { cloneElement, isValidElement } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string[];
  children: React.ReactNode;
}

const INPUT_BASE =
  'w-full bg-background rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2';
const INPUT_ERROR = 'border-red-500 focus:ring-red-500';
const INPUT_NORMAL = 'border-border focus:ring-primary/20';

export const FormField = ({ label, htmlFor, error, children }: FormFieldProps) => {
  const styleChild = isValidElement<{ className?: string }>(children)
    ? cloneElement(children, {
        className: [
          INPUT_BASE,
          error ? INPUT_ERROR : INPUT_NORMAL,
          children.props.className ?? '',
        ]
          .join(' ')
          .trim(),
      })
    : children;

  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>

      {styleChild}
      <FieldError error={error} />
    </div>
  );
};
