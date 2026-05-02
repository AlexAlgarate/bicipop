export type ProfileFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
  requestId: number;
  values?: Record<string, string>;
};

export const getFieldError = (
  state: ProfileFormState | null,
  field: string
): string[] | undefined => state?.errors?.[field];
