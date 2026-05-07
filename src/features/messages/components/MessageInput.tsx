'use client';

import { useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSend: (formData: FormData) => void;
  isPending: boolean;
}

export const MessageInput = ({ onSend, isPending }: MessageInputProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = String(formData.get('content')).trim();
    if (!content) return;

    onSend(formData);
    formRef.current?.reset();

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const handleInput = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          name="content"
          placeholder="Write a message... (Enter to send, Shift+Enter for new line)"
          rows={1}
          maxLength={2000}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={isPending}
          className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 min-h-10.5 max-h-30 leading-relaxed"
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
};
