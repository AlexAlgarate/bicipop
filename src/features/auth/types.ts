export type AuthFormState = {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
  values: Record<string, string>;
};
