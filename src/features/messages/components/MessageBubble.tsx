import type { MessageDTO } from '@/domain/message/types';
import { formatDate } from '@/utils/format';

interface MessageBubbleProps {
  message: MessageDTO;
  isOwn: boolean;
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  const isOptimistic = message.id.startsWith('optimistic-');

  return (
    <div className={`flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
          ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-card border border-border text-foreground rounded-bl-sm'
          } 
          ${isOptimistic ? 'opacity-70' : 'opacity-100'} `}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
      </div>
      <span className="text-[10px] text-muted px-1">
        {isOptimistic ? 'Enviando...' : formatDate(message.createdAt)}
      </span>
    </div>
  );
};
