'use client';

import { useEffect, useRef, useState, useTransition } from 'react';

import type { ConversationWithMessages, MessageDTO } from '@/domain/message/types';
import { supabase } from '@/infrastructure/db/supabase/supabase';

import { markAsReadAction, sendMessageAction } from '../actions';

import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface ChatViewProps {
  conversation: ConversationWithMessages;
  currentUserId: string;
}

export const ChatView = ({ conversation, currentUserId }: ChatViewProps) => {
  const [messages, setMessages] = useState<MessageDTO[]>(conversation.messages);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    markAsReadAction(conversation.id);
  }, [conversation.id]);

  useEffect(() => {
    const channel = supabase
      .channel(`conversation:${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `conversationId=eq.${conversation.id}`,
        },
        payload => {
          const newMessage = payload.new as {
            id: string;
            content: string;
            senderId: string;
            conversationId: string;
            readAt: string | null;
            createdAt: string;
          };

          setMessages(prev => {
            const exists = prev.some(m => m.id === newMessage.id);
            if (exists) return prev;

            return [
              ...prev,
              {
                id: newMessage.id,
                content: newMessage.content,
                senderId: newMessage.senderId,
                senderUsername:
                  newMessage.senderId === conversation.buyerId
                    ? conversation.buyerUsername
                    : conversation.sellerUsername,
                conversationId: newMessage.conversationId,
                readAt: newMessage.readAt ? new Date(newMessage.readAt) : null,
                createdAt: new Date(newMessage.createdAt),
              },
            ];
          });

          if (newMessage.senderId !== currentUserId) {
            markAsReadAction(conversation.id);
          }
        }
      )
      .subscribe((status, error) => {
        console.log('STATUS', status);
        console.log('ERROR', error);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    conversation.id,
    conversation.buyerId,
    conversation.sellerId,
    currentUserId,
    conversation.buyerUsername,
    conversation.sellerUsername,
  ]);

  const handleSend = async (formData: FormData) => {
    const content = String(formData.get('content')).trim();
    if (!content) return;

    const optimisticMessage: MessageDTO = {
      id: `optimistic-${Date.now()}`,
      content,
      senderId: currentUserId,
      senderUsername: 'Tú',
      conversationId: conversation.id,
      readAt: null,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, optimisticMessage]);

    startTransition(async () => {
      const result = await sendMessageAction(conversation.id, formData);

      if (!result.success) {
        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted">No messages yet. Say hello!</p>
          </div>
        )}

        {messages.map(message => (
          <MessageBubble
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
