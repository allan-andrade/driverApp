'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { FormEvent, useMemo, useState } from 'react';
import { ChatConversation, ChatMessage } from '@driver-school/types';
import { clientApiRequest } from '@/lib/client-api';

export function ChatBookingPanel({ bookingId }: { bookingId: string }) {
  const [content, setContent] = useState('');

  const conversation = useMutation({
    mutationFn: () =>
      clientApiRequest<ChatConversation>(`/chat/booking/${bookingId}`, {
        method: 'POST',
      }),
  });

  const conversationId = conversation.data?.id;

  const messages = useQuery({
    queryKey: ['chat-messages', conversationId],
    queryFn: () => clientApiRequest<ChatMessage[]>(`/chat/${conversationId}/messages`),
    enabled: Boolean(conversationId),
    refetchInterval: 3000,
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!conversationId || !content.trim()) {
        return null;
      }

      return clientApiRequest<ChatMessage>(`/chat/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
    onSuccess: () => {
      setContent('');
      void messages.refetch();
    },
  });

  const sortedMessages = useMemo(
    () => [...(messages.data ?? [])].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [messages.data],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage.mutate();
  };

  return (
    <article className="panel space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Chat</p>
          <h3 className="mt-1 text-lg font-semibold text-ink">Comunicacao da reserva</h3>
        </div>
        <button
          type="button"
          onClick={() => conversation.mutate()}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
        >
          {conversation.isPending ? 'Conectando...' : 'Abrir conversa'}
        </button>
      </div>

      <div className="h-72 overflow-auto rounded-2xl border border-slate-200 bg-white p-3">
        {sortedMessages.length === 0 && <p className="text-sm text-slate-500">Nenhuma mensagem ainda.</p>}
        <div className="space-y-2">
          {sortedMessages.map((message) => (
            <div key={message.id} className="rounded-xl bg-slate-50 p-2 text-sm">
              <p className="text-xs text-slate-500">{new Date(message.createdAt).toLocaleString('pt-BR')}</p>
              <p className="text-slate-800">{message.content}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escreva uma mensagem"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          disabled={!conversationId}
        />
        <button
          type="submit"
          disabled={!conversationId || sendMessage.isPending || !content.trim()}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Enviar
        </button>
      </form>
    </article>
  );
}
