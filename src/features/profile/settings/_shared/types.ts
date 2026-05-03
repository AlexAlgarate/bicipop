import type { FormState } from '@/utils/types/form-state';

export type ProfileFormState = FormState<{
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  email: string;
  username: string;
}>;

export const getFieldError = (
  state: FormState | null,
  field: string
): string[] | undefined => state?.errors?.[field];
