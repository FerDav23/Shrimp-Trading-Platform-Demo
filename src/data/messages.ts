export interface Message {
  id: string;
  from: string;
  fromId: string;
  fromRole: string;
  to: string;
  toId: string;
  toRole: string;
  subject: string;
  preview: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export const dummyMessages: Message[] = [
  {
    id: 'msg-1',
    from: 'Juan Pérez',
    fromId: 'producer-1',
    fromRole: 'PRODUCER',
    to: 'ROSASUD S.A.S.',
    toId: 'packer-rosasud',
    toRole: 'PACKER',
    subject: 'Consulta sobre oferta #OF-001',
    preview: 'Hola, me interesa tu oferta de camarones...',
    text: 'Hola, me interesa tu oferta de camarones enteros. ¿Podrías darme más información sobre la disponibilidad?',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-2',
    from: 'María González',
    fromId: 'producer-2',
    fromRole: 'PRODUCER',
    to: 'ROSASUD S.A.S.',
    toId: 'packer-rosasud',
    toRole: 'PACKER',
    subject: 'Confirmación de compra',
    preview: 'Gracias por la oferta, confirmo la compra...',
    text: 'Gracias por la oferta, confirmo la compra de 300 lb de cola directa.',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-3',
    from: 'Sistema',
    fromId: 'system',
    fromRole: 'SYSTEM',
    to: 'ROSASUD S.A.S.',
    toId: 'packer-rosasud',
    toRole: 'PACKER',
    subject: 'Nueva oferta publicada',
    preview: 'Tu oferta ha sido publicada exitosamente...',
    text: 'Tu oferta ROS-ENT-2024-001 ha sido publicada exitosamente y está visible para los productores.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-4',
    from: 'Carlos Ramírez',
    fromId: 'producer-3',
    fromRole: 'PRODUCER',
    to: 'ROSASUD S.A.S.',
    toId: 'packer-rosasud',
    toRole: 'PACKER',
    subject: 'Consulta sobre tamaños disponibles',
    preview: 'Hola, tengo una consulta sobre los tamaños...',
    text: 'Hola, tengo una consulta sobre los tamaños disponibles en tu oferta actual.',
    isRead: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-5',
    from: 'Ana Martínez',
    fromId: 'producer-4',
    fromRole: 'PRODUCER',
    to: 'ROSASUD S.A.S.',
    toId: 'packer-rosasud',
    toRole: 'PACKER',
    subject: 'Información sobre certificaciones',
    preview: 'Buen día, necesito información sobre certificaciones...',
    text: 'Buen día, necesito información sobre certificaciones para exportación.',
    isRead: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  // Mensajes para productores
  {
    id: 'msg-6',
    from: 'ROSASUD S.A.S.',
    fromId: 'packer-rosasud',
    fromRole: 'PACKER',
    to: 'Juan Pérez',
    toId: 'producer-1',
    toRole: 'PRODUCER',
    subject: 'Respuesta a tu consulta',
    preview: 'Gracias por tu interés. Tenemos disponibilidad...',
    text: 'Gracias por tu interés. Tenemos disponibilidad inmediata de 500 lb.',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-7',
    from: 'ROSASUD S.A.S.',
    fromId: 'packer-rosasud',
    fromRole: 'PACKER',
    to: 'María González',
    toId: 'producer-2',
    toRole: 'PRODUCER',
    subject: 'Confirmación de orden',
    preview: 'Tu orden ha sido confirmada. Detalles...',
    text: 'Tu orden ha sido confirmada. Los detalles de entrega se enviarán próximamente.',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];
