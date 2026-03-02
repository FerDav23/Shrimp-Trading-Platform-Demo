import React, { RefObject } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { RequestMessage } from '../../../data/requestMessages';
import { messagesSection } from '../../../styles';
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
  <section className={messagesSection.container}>
    <button
      type="button"
      onClick={onToggle}
      className={messagesSection.headerButton}
    >
      <div className="flex items-center gap-2">
        <h3 className={messagesSection.title}>Mensajes sobre esta Solicitud</h3>
        {!isMessagesActive && (
          <span className={messagesSection.readOnlyBadge}>Solo lectura</span>
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
        <div className={messagesSection.messagesBox}>
          <div
            className={`${messagesSection.messagesArea} ${isMessagesActive ? messagesSection.messagesAreaActive : messagesSection.messagesAreaReadOnly}`}
          >
            {messages.length === 0 ? (
              <div
                className={isMessagesActive ? messagesSection.emptyText : messagesSection.emptyTextReadOnly}
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
                            ? messagesSection.bubblePacker
                            : messagesSection.bubbleProducer
                          : isPacker
                            ? messagesSection.bubblePackerReadOnly
                            : messagesSection.bubbleProducerReadOnly
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
            <div className={messagesSection.inputArea}>
              <div className="flex gap-2">
                <textarea
                  value={messageText}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_MESSAGE_LENGTH) onMessageTextChange(e.target.value);
                  }}
                  placeholder="Escribe tu mensaje..."
                  className={messagesSection.textarea}
                  rows={2}
                />
                <button
                  type="button"
                  onClick={onSendMessage}
                  disabled={!messageText.trim() || messageText.length > MAX_MESSAGE_LENGTH}
                  className={messagesSection.sendButton}
                >
                  Enviar
                </button>
              </div>
              <div className={messagesSection.charCount}>
                {messageText.length}/{MAX_MESSAGE_LENGTH} caracteres
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </section>
);
