export const Button = ({
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`cursor-pointer transition-colors rounded-full px-4 py-2 active:scale-[0.98] ${className}`}
      {...props}
    />
  );
};
