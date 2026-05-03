import { cloneElement, isValidElement, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { FieldError } from '@/components/ui/FieldError';

export const FIELD_STYLE = {
  base: 'w-full bg-background rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2',
  error: 'border-red-500 focus:ring-red-500',
  normal: 'border-border focus:ring-primary',
};

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string[];
  children: React.ReactNode;
}

interface PasswordToggleProps {
  type?: string;
}

export const FormField = ({ label, htmlFor, error, children }: FormFieldProps) => {
  const childProps = isValidElement<PasswordToggleProps>(children) ? children.props : {};
  const isPassword = childProps.type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : childProps.type;

  const styledChild = isValidElement<{ className?: string; type?: string }>(children)
    ? cloneElement(children, {
        type: inputType,
        className: [
          FIELD_STYLE.base,
          error ? FIELD_STYLE.error : FIELD_STYLE.normal,
          isPassword ? 'pr-10' : '',
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
      <div className="relative">
        {styledChild}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      <FieldError error={error} />
    </div>
  );
};
