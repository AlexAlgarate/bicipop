'use client';

import { Check, X } from 'lucide-react';

import { MIN_PASSWORD_LENGTH } from '@/utils/constants';

interface PasswordRulesProps {
  password: string;
}

export const PasswordRules = ({ password }: PasswordRulesProps) => {
  const hasInput = password.length > 0;

  const rules = {
    length: password.length >= MIN_PASSWORD_LENGTH,
    upperLowerNumber:
      /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const items = [
    { key: 'length', label: 'Mínimo 8 caracteres', rule: rules.length },
    {
      key: 'upperLowerNumber',
      label: 'Mayúsculas, minúsculas y números',
      rule: rules.upperLowerNumber,
    },
    { key: 'symbol', label: 'Al menos un símbolo', rule: rules.symbol },
  ];

  return (
    <div className="space-y-1 mt-2 text-xs">
      {items.map(({ key, label, rule }) => {
        const color = !hasInput
          ? 'text-muted-foreground'
          : rule
            ? 'text-green-500'
            : 'text-red-500';

        const Icon = rule ? Check : X;

        return (
          <p
            key={key}
            className={`flex items-center gap-1.5 text-xs transition-colors ${color}`}
          >
            {hasInput && <Icon className="w-3 h-3 shrink-0" />}
            {!hasInput && (
              <span className="w-3 h-3 shrink-0 flex items-center justify-center">
                ·
              </span>
            )}
            {label}
          </p>
        );
      })}
    </div>
  );
};
