export interface UserDto {
  id: string;
  email: string;
}

export interface AuthUser {
  id: string;
  email: string;
  passwordHash: string;
}

export type AuthFormState = {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
  values: Record<string, string>;
};

export const initialRegisterState: AuthFormState = {
  success: false,
  errors: {},
  message: '',
  values: {
    email: '',
    password: '',
    location: '',
    username: '',
  },
};
