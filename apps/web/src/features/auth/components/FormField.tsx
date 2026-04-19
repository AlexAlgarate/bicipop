'use client';
import { ChangeEventHandler, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { FieldError } from '@/components/FieldError';

type Props = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string | string[];
  placeholder: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  clientError?: boolean;
};

export function FormField({
  label,
  name,
  type = 'text',
  defaultValue,
  error,
  placeholder,
  onChange,
  clientError,
}: Props) {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const hasError = !!error || clientError;

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={[
            'w-full rounded-lg border px-3 py-2 text-sm',
            'bg-white dark:bg-background',
            'text-foreground placeholder:text-muted-foreground',
            isPassword ? 'pr-10' : '',
            hasError
              ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
              : 'border-gray-300 dark:border-border focus:outline-none focus:ring-2 focus:ring-primary/20',
          ].join(' ')}
          onChange={onChange}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar constraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <FieldError error={error} />
    </div>
  );
}
