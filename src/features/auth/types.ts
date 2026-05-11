import type { FormState } from '@/utils/types/form-state';

export type AuthFormState = FormState<{
  email?: string;
  username?: string;
  password?: string;
}>;

export const initialRegisterState: AuthFormState = {
  success: false,
  errors: {},
  message: '',
  values: {
    email: '',
    password: '',
    username: '',
  },
};
