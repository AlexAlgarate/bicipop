'use client';

import { useEffect, useState, useTransition } from 'react';

import { supabase } from '@/infrastructure/db/supabase/supabase';
import type { ConversationWithMessages, MessageDTO } from '@/domain/message/types';
import { markAsReadAction, sendMessageAction } from '@/features/profile/messages/actions';

export const useChat = (
  conversation: ConversationWithMessages,
  currentUserId: string
) => {
  const [messages, setMessages] = useState<MessageDTO[]>(conversation.messages);
  const [isPending, startTransition] = useTransition();

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
          // filter: `conversationId=eq.${conversation.id}`,
        },
        payload => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newMessage = payload.new as any;

          if (newMessage.conversationId !== conversation.id) return;

          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;

            const mappedMessage: MessageDTO = {
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
            };

            if (newMessage.senderId === currentUserId) {
              const optimisticIndex = prev.findIndex(
                m => m.id.startsWith('optimistic-') && m.content === newMessage.content
              );

              if (optimisticIndex !== -1) {
                const newMessages = [...prev];
                newMessages[optimisticIndex] = mappedMessage;
                return newMessages;
              }
            }

            return [...prev, mappedMessage];
          });

          if (newMessage.senderId !== currentUserId) {
            markAsReadAction(conversation.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation, currentUserId]);

  const handleSend = async (formData: FormData) => {
    const content = String(formData.get('content')).trim();
    if (!content) return;

    const optimisticMessage: MessageDTO = {
      id: `optimistic-${Date.now()}`,
      content,
      senderId: currentUserId,
      senderUsername: 'You',
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

  return {
    messages,
    isPending,
    handleSend,
  };
};
