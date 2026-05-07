'use client';

import { useEffect, useRef } from 'react';

import type { ConversationWithMessages } from '@/domain/message/types';
import { useChat } from '@/features/profile/messages/hooks/useChat';

import { ChatBubble } from './ChatBubble';
import { MessageInput } from './ChatInput';

interface ChatViewProps {
  conversation: ConversationWithMessages;
  currentUserId: string;
}

export const ChatView = ({ conversation, currentUserId }: ChatViewProps) => {
  const { messages, isPending, handleSend } = useChat(conversation, currentUserId);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  console.log(
    `[ChatView] [CreatedAt] ${messages.forEach(msg => console.log(msg.createdAt))}`
  );
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted">No messages yet. Say hello!</p>
          </div>
        )}

        {messages.map(message => (
          <ChatBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUserId}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} isPending={isPending} />
    </div>
  );
};
