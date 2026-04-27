/**
 * Checks if an error is a Next.js control flow error that should be re-thrown
 * These are: NEXT_REDIRECT, NEXT_NOT_FOUND, etc.
 */
export const isNextControlFlowError = (error: unknown): boolean => {
  // Check for Next.js redirect/not-found errors by digest
  if (error instanceof Error && 'digest' in error) {
    const digest = (error as Record<string, unknown>).digest;
    if (typeof digest === 'string' && digest.startsWith('NEXT_')) {
      return true;
    }
  }
  return false;
};

/**
 * Serializes an error to ensure it's JSON-serializable
 * Handles Error objects, nested errors, and complex error structures
 */
export const serializeError = (error: unknown): string => {
  // If it's already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // Handle Error objects
  if (error instanceof Error) {
    const cause = error.cause ? String(error.cause) : undefined;
    const errorInfo: Record<string, unknown> = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
    if (cause) {
      errorInfo.cause = cause;
    }
    return JSON.stringify(errorInfo);
  }

  // Handle objects with toString method
  if (error && typeof error === 'object' && 'toString' in error) {
    try {
      // Try to stringify the object
      return JSON.stringify(error, null, 2);
    } catch {
      // If stringification fails, use toString
      return String(error);
    }
  }

  // Fallback: convert to string
  return String(error) || 'Unknown error occurred';
};

/**
 * Logs an error with full details for debugging
 * Re-throws Next.js control flow errors (NEXT_REDIRECT, etc.)
 * Returns a user-friendly error message for actual errors
 */
export const logAndSerializeError = (
  error: unknown,
  context: string = 'Error'
): { userMessage: string; details: string } => {
  // Check if this is a Next.js control flow error and re-throw it
  if (isNextControlFlowError(error)) {
    throw error;
  }

  const serialized = serializeError(error);

  // Log everything to server console for debugging
  console.error(`[${context}] Error occurred:`, error);
  if (error instanceof Error) {
    console.error(`[${context}] Stack trace:`, error.stack);
  }
  console.error(`[${context}] Serialized:`, serialized);

  // Create user-friendly message
  let userMessage = 'An error occurred. Please try again.';

  if (error instanceof Error) {
    userMessage = error.message;
  } else if (typeof error === 'string') {
    userMessage = error;
  }

  return {
    userMessage,
    details: serialized,
  };
};

/**
 * Safely converts error messages to a serializable array
 */
export const toErrorArray = (message: string): string[] => {
  if (!message) return ['Unknown error'];
  if (typeof message !== 'string') return [String(message)];
  return [message];
};
