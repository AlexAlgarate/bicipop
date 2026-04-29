export type ProductFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
  requestId: number;
  values?: Record<string, string | number>;
};
