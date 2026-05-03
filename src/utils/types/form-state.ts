export type FormState<
  TValues extends Record<string, string | number> = Record<string, string>,
> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
  requestId?: number;
  values?: Partial<TValues>;
};
