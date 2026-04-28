export const isNextControlFlowError = (error: unknown): boolean => {
  if (error instanceof Error && 'digest' in error) {
    const digest = (error as Record<string, unknown>).digest;
    if (typeof digest === 'string' && digest.startsWith('NEXT_')) {
      return true;
    }
  }
  return false;
};

export const serializeError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

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

  if (error && typeof error === 'object' && 'toString' in error) {
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return String(error);
    }
  }

  return String(error) || 'Unknown error occurred';
};

export const logAndSerializeError = (
  error: unknown,
  context: string = 'Error'
): { userMessage: string; details: string } => {
  if (isNextControlFlowError(error)) {
    throw error;
  }

  const serialized = serializeError(error);

  console.error(`[${context}] Error occurred:`, error);
  if (error instanceof Error) {
    console.error(`[${context}] Stack trace:`, error.stack);
  }
  console.error(`[${context}] Serialized:`, serialized);

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

export const toErrorArray = (message: string): string[] => {
  if (!message) return ['Unknown error'];
  if (typeof message !== 'string') return [String(message)];
  return [message];
};
