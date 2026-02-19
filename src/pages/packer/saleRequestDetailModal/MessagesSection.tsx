import React, { RefObject } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { RequestMessage } from '../../../data/requestMessages';
import { MAX_MESSAGE_LENGTH } from './constants';

interface MessagesSectionProps {
  messages: RequestMessage[];
  messageText: string;
  onMessageTextChange: (value: string) => void;
  onSendMessage: () => void;
  expanded: boolean;
  onToggle: () => void;
  isMessagesActive: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export const MessagesSection: React.FC<MessagesSectionProps> = ({
  messages,
  messageText,
  onMessageTextChange,
  onSendMessage,
  expanded,
  onToggle,
  isMessagesActive,
  messagesEndRef,
}) => (
  <section className="rounded-xl border-2 border-sky-400/60 bg-sky-50 shadow-sm overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 text-left text-gray-900 transition-colors ${
        isMessagesActive ? 'hover:bg-sky-100/50' : 'hover:bg-sky-100/50 cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Mensajes sobre esta Solicitud</h3>
        {!isMessagesActive && (
          <span className="text-xs font-medium text-gray-700 bg-gray-200 px-2 py-0.5 rounded">
            Solo lectura
          </span>
        )}
      </div>
      <span className="text-gray-700">
        <svg
          className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
    {expanded && (
      <div className="px-6 pb-6">
        <div className="rounded-lg overflow-hidden border bg-white border-sky-200">
          <div
            className={`h-64 overflow-y-auto p-4 space-y-3 ${isMessagesActive ? 'bg-gray-50/50' : 'bg-gray-100/50'}`}
          >
            {messages.length === 0 ? (
              <div
                className={`text-center py-8 text-sm ${isMessagesActive ? 'text-gray-500' : 'text-gray-400'}`}
              >
                {isMessagesActive
                  ? 'No hay mensajes aún. Inicia la conversación enviando un mensaje.'
                  : 'No hay mensajes en el historial de esta solicitud.'}
              </div>
            ) : (
              messages.map((msg) => {
                const isPacker = msg.senderRole === 'PACKER';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isPacker ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        isMessagesActive
                          ? isPacker
                            ? 'bg-sky-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                          : isPacker
                            ? 'bg-gray-400 text-gray-100'
                            : 'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1 opacity-80">{msg.senderName}</div>
                      <div className="text-sm">{msg.text}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {format(new Date(msg.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          {isMessagesActive && (
            <div className="p-4 border-t border-sky-200 bg-white">
              <div className="flex gap-2">
                <textarea
                  value={messageText}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_MESSAGE_LENGTH) onMessageTextChange(e.target.value);
                  }}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={onSendMessage}
                  disabled={!messageText.trim() || messageText.length > MAX_MESSAGE_LENGTH}
                  className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                >
                  Enviar
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-right">
                {messageText.length}/{MAX_MESSAGE_LENGTH} caracteres
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </section>
);
