import { cloneElement, isValidElement } from 'react';

import { FieldError } from '@/components/ui/FieldError';
import { FIELD_STYLE } from './field-style';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string[];
  children: React.ReactNode;
}

export const FormField = ({ label, htmlFor, error, children }: FormFieldProps) => {
  const styleChild = isValidElement<{ className?: string }>(children)
    ? cloneElement(children, {
        className: [
          FIELD_STYLE.base,
          error ? FIELD_STYLE.error : FIELD_STYLE.normal,
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
