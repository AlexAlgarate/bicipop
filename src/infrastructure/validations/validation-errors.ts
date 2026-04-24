import z from 'zod';

export const getFieldErrorsFromTree = <T>(
  error: z.ZodError<T>
): Record<string, string[]> => {
  try {
    const tree = z.treeifyError(error);
    const fieldErrors: Record<string, string[]> = {};

    if (!('properties' in tree) || !tree.properties) return fieldErrors;

    for (const [fieldName, node] of Object.entries(tree.properties)) {
      if (node && typeof node === 'object' && 'errors' in node) {
        const errors = (node as { errors: unknown }).errors;
        if (Array.isArray(errors) && errors.length) {
          fieldErrors[fieldName] = errors.map(err =>
            typeof err === 'string' ? err : String(err)
          );
        }
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      console.warn('[Validation] Field errors detected:', fieldErrors);
    }

    return fieldErrors;
  } catch (parseError) {
    console.error('[Validation] Failed to parse validation errors:', parseError);
    return {};
  }
};
