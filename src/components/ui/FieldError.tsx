interface FieldErrorProps {
  error?: string | string[];
}

export const FieldError = ({ error }: FieldErrorProps) => {
  if (!error) return null;

  const errors = Array.isArray(error) ? error : [error];

  return (
    <>
      {errors.map((e, i) => (
        <p key={i} className="text-xs md:text-sm text-red-400">
          {e}
        </p>
      ))}
    </>
  );
};
