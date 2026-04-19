import z from 'zod';

export const getFieldErrorsFromTree = <T>(
  error: z.ZodError<T>,
): Record<string, string[]> => {
  const tree = z.treeifyError(error);
  const fieldErrors: Record<string, string[]> = {};

  if (!('properties' in tree) || !tree.properties) return fieldErrors;

  for (const [fieldName, node] of Object.entries(tree.properties)) {
    if (node && typeof node === 'object' && 'errors' in node) {
      const errors = (node as { errors: unknown }).errors;
      if (Array.isArray(errors) && errors.length) {
        fieldErrors[fieldName] = errors as string[];
      }
    }
  }

  return fieldErrors;
};
