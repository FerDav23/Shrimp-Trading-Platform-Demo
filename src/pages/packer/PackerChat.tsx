import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export const PackerChat: React.FC = () => {
  useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  // Mensajes por conversación
  const getMessagesForConversation = (conversationId: string): Message[] => {
    const now = Date.now();
    const baseMessages: Record<string, Message[]> = {
      'conv-1': [
        {
          id: 'msg-1-1',
          text: 'Hola, me interesa tu oferta de camarones enteros',
          senderId: 'producer-1',
          senderName: 'Juan Pérez',
          timestamp: new Date(now - 3 * 60 * 60 * 1000),
          isRead: false,
        },
        {
          id: 'msg-1-2',
          text: 'Hola Juan, con gusto te ayudo. ¿Qué cantidad necesitas?',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 2.5 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-1-3',
          text: 'Necesito alrededor de 500 lb',
          senderId: 'producer-1',
          senderName: 'Juan Pérez',
          timestamp: new Date(now - 2 * 60 * 60 * 1000),
          isRead: false,
        },
        {
          id: 'msg-1-4',
          text: 'Perfecto, tenemos disponibilidad. El precio es $8.50 por libra. ¿Te parece bien?',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 1.5 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-1-5',
          text: 'Sí, está bien el precio. ¿Cuándo puedo recibir el producto?',
          senderId: 'producer-1',
          senderName: 'Juan Pérez',
          timestamp: new Date(now - 1 * 60 * 60 * 1000),
          isRead: false,
        },
        {
          id: 'msg-1-6',
          text: 'Podemos entregar en 3 días hábiles. ¿Cuál es tu dirección de entrega?',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 45 * 60 * 1000),
          isRead: true,
        },
      ],
      'conv-2': [
        {
          id: 'msg-2-1',
          text: 'Buenos días, vi tu oferta de cola directa',
          senderId: 'producer-2',
          senderName: 'María González',
          timestamp: new Date(now - 6 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-2-2',
          text: 'Hola María, sí tenemos cola directa disponible. ¿Cuántas libras necesitas?',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 5.5 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-2-3',
          text: 'Necesito 300 lb para esta semana',
          senderId: 'producer-2',
          senderName: 'María González',
          timestamp: new Date(now - 5 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-2-4',
          text: 'Perfecto, tenemos esa cantidad disponible. El precio es $7.80 por libra',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 4.5 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-2-5',
          text: 'Gracias por la información, confirmo la compra',
          senderId: 'producer-2',
          senderName: 'María González',
          timestamp: new Date(now - 4 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-2-6',
          text: 'Excelente, te enviaré los detalles de la orden en breve',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 3.5 * 60 * 60 * 1000),
          isRead: true,
        },
      ],
      'conv-3': [
        {
          id: 'msg-3-1',
          text: 'Hola, necesito coordinar el envío de la orden #ORD-123',
          senderId: 'logistics-1',
          senderName: 'Grupo FJ Logística',
          timestamp: new Date(now - 25 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-3-2',
          text: 'Hola, sí. La orden está lista para envío. ¿Cuándo pueden recoger?',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 24.5 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-3-3',
          text: 'Podemos recoger mañana en la mañana, alrededor de las 9 AM',
          senderId: 'logistics-1',
          senderName: 'Grupo FJ Logística',
          timestamp: new Date(now - 24 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-3-4',
          text: 'Perfecto, estaremos listos. La dirección es Calle Principal 123, Guayaquil',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 23.5 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-3-5',
          text: 'El envío está programado para mañana',
          senderId: 'logistics-1',
          senderName: 'Grupo FJ Logística',
          timestamp: new Date(now - 23 * 60 * 60 * 1000),
          isRead: true,
        },
      ],
      'conv-4': [
        {
          id: 'msg-4-1',
          text: 'Hola, tengo una consulta sobre los tamaños disponibles',
          senderId: 'producer-3',
          senderName: 'Carlos Ramírez',
          timestamp: new Date(now - 12 * 60 * 60 * 1000),
          isRead: false,
        },
        {
          id: 'msg-4-2',
          text: 'Hola Carlos, tenemos disponibles tamaños 16/20, 21/25 y 26/30',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 11.5 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-4-3',
          text: '¿Cuál es el precio del tamaño 16/20?',
          senderId: 'producer-3',
          senderName: 'Carlos Ramírez',
          timestamp: new Date(now - 11 * 60 * 60 * 1000),
          isRead: false,
        },
        {
          id: 'msg-4-4',
          text: 'El precio del 16/20 es $9.20 por libra',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 10.5 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-4-5',
          text: 'Perfecto, voy a revisar y te confirmo',
          senderId: 'producer-3',
          senderName: 'Carlos Ramírez',
          timestamp: new Date(now - 10 * 60 * 60 * 1000),
          isRead: false,
        },
      ],
      'conv-5': [
        {
          id: 'msg-5-1',
          text: 'Buen día, necesito información sobre certificaciones',
          senderId: 'producer-4',
          senderName: 'Ana Martínez',
          timestamp: new Date(now - 8 * 60 * 60 * 1000),
          isRead: false,
        },
        {
          id: 'msg-5-2',
          text: 'Hola Ana, tenemos certificación HACCP y BPM. ¿Necesitas alguna específica?',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 7.5 * 60 * 60 * 1000),
          isRead: true,
        },
        {
          id: 'msg-5-3',
          text: 'Sí, necesito certificación para exportación',
          senderId: 'producer-4',
          senderName: 'Ana Martínez',
          timestamp: new Date(now - 7 * 60 * 60 * 1000),
          isRead: false,
        },
        {
          id: 'msg-5-4',
          text: 'Tenemos certificación de exportación. Te puedo enviar los documentos',
          senderId: 'packer-rosasud',
          senderName: 'ROSASUD S.A.S.',
          timestamp: new Date(now - 6.5 * 60 * 60 * 1000),
          isRead: true,
        },
      ],
    };
    return baseMessages[conversationId] || [];
  };

  // Conversaciones dummy
  const [conversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participantId: 'producer-1',
      participantName: 'Juan Pérez',
      participantRole: 'PRODUCER',
      lastMessage: {
        id: 'msg-1-6',
        text: 'Podemos entregar en 3 días hábiles. ¿Cuál es tu dirección de entrega?',
        senderId: 'packer-rosasud',
        senderName: 'ROSASUD S.A.S.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isRead: false,
      },
      unreadCount: 2,
      updatedAt: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      id: 'conv-2',
      participantId: 'producer-2',
      participantName: 'María González',
      participantRole: 'PRODUCER',
      lastMessage: {
        id: 'msg-2-6',
        text: 'Excelente, te enviaré los detalles de la orden en breve',
        senderId: 'packer-rosasud',
        senderName: 'ROSASUD S.A.S.',
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        isRead: true,
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    },
    {
      id: 'conv-3',
      participantId: 'logistics-1',
      participantName: 'Grupo FJ Logística',
      participantRole: 'LOGISTICS',
      lastMessage: {
        id: 'msg-3-5',
        text: 'El envío está programado para mañana',
        senderId: 'logistics-1',
        senderName: 'Grupo FJ Logística',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
        isRead: true,
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    },
    {
      id: 'conv-4',
      participantId: 'producer-3',
      participantName: 'Carlos Ramírez',
      participantRole: 'PRODUCER',
      lastMessage: {
        id: 'msg-4-5',
        text: 'Perfecto, voy a revisar y te confirmo',
        senderId: 'producer-3',
        senderName: 'Carlos Ramírez',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
        isRead: false,
      },
      unreadCount: 3,
      updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    },
    {
      id: 'conv-5',
      participantId: 'producer-4',
      participantName: 'Ana Martínez',
      participantRole: 'PRODUCER',
      lastMessage: {
        id: 'msg-5-4',
        text: 'Tenemos certificación de exportación. Te puedo enviar los documentos',
        senderId: 'packer-rosasud',
        senderName: 'ROSASUD S.A.S.',
        timestamp: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
        isRead: false,
      },
      unreadCount: 2,
      updatedAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
    },
  ]);

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const conversationMessages = selectedConversation ? getMessagesForConversation(selectedConversation) : [];

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    // Aquí se implementará la lógica para enviar mensajes
    console.log('Enviar mensaje:', messageText);
    setMessageText('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Mensajes</h1>
      
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Lista de conversaciones */}
        <div className="w-1/3 flex flex-col border-2 border-sky-400/60 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="p-4 border-b border-sky-300/60 bg-[#4aa3e0]">
            <h2 className="font-semibold text-white">Conversaciones</h2>
          </div>
          <div className="flex-1 overflow-y-auto bg-white/70">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-sky-300/40 cursor-pointer hover:bg-sky-50/50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-sky-100/70 border-sky-400/60' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className={`font-medium ${selectedConversation === conversation.id ? 'text-slate-800' : 'text-slate-700'}`}>
                      {conversation.participantName}
                    </h3>
                    <p className="text-xs text-slate-500">{conversation.participantRole}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-yellow-600 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <>
                    <p className="text-sm text-slate-600 truncate mb-1">
                      {conversation.lastMessage.text}
                    </p>
                    <p className="text-xs text-slate-400">
                      {format(conversation.lastMessage.timestamp, 'dd MMM, HH:mm', { locale: es })}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 flex flex-col border-2 border-sky-400/60 rounded-xl overflow-hidden shadow-sm bg-white">
          {selectedConversation && selectedConv ? (
            <>
              {/* Header de la conversación */}
              <div className="p-4 border-b border-sky-300/60 bg-[#4aa3e0]">
                <h2 className="font-semibold text-white">{selectedConv.participantName}</h2>
                <p className="text-xs text-white/80">{selectedConv.participantRole}</p>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/70">
                {conversationMessages.map((message) => {
                  const isOwnMessage = message.senderId === 'packer-rosasud';
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
                          isOwnMessage
                            ? 'bg-sky-600 text-white'
                            : 'bg-white border border-sky-300/60 text-slate-800'
                        }`}
                      >
                        {!isOwnMessage && (
                          <p className="text-xs font-medium mb-1 text-slate-600">
                            {message.senderName}
                          </p>
                        )}
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-sky-100' : 'text-slate-500'
                          }`}
                        >
                          {format(message.timestamp, 'HH:mm', { locale: es })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input de mensaje */}
              <div className="p-4 border-t border-sky-300/60 bg-white/80">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 border border-sky-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white/70">
              <div className="text-center">
                <p className="text-lg font-medium mb-2 text-slate-700">Selecciona una conversación</p>
                <p className="text-sm text-slate-500">Elige una conversación de la lista para comenzar a chatear</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
