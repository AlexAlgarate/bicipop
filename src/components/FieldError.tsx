interface FieldErrorProps {
  error?: string | string[];
}

export const FieldError = ({ error }: FieldErrorProps) => {
  if (!error) return null;

  return <p className="text-xs md:text-sm text-red-500 dark:text-red-400">{error}</p>;
};
