import type { FormState } from '@/utils/types/form-state';

export type MessageFormState = FormState<{
  content: string;
}>;

export type StartConversationState = FormState;
