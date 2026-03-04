import type { SectionKey } from './types';

export const MAX_MESSAGE_LENGTH = 500;

/** Etiquetas de las pestañas del modal de detalle (por SectionKey) */
export const SECTION_LABELS: Record<SectionKey, string> = {
  general: 'Información General',
  catch: 'Información de Pesca',
  packerNotes: 'Notas del Packer',
  logisticsTracking: 'Logistica',
  settlement: 'Liquidación de pesca',
  settlementReadOnly: 'Liquidación de pesca',
  advanceTransfer: 'Transferencia de anticipo',
  advanceReadOnly: 'Anticipo pagado',
  balanceTransfer: 'Pago del saldo',
  balanceReadOnly: 'Saldo restante pagado',
  messages: 'Mensajes',
  rejectForm: 'Motivo del rechazo',
};

/** Opciones del dropdown de motivo de rechazo (packer elige al rechazar) */
export const REJECTION_REASONS = [
  { value: '', label: 'Seleccione un motivo...' },
  { value: 'SIZE_RANGE', label: 'No cumple con el rango de tallas requerido para esta oferta.' },
  { value: 'NO_CAPACITY', label: 'Sin capacidad de procesamiento en la fecha indicada.' },
  { value: 'PRICE', label: 'Condiciones de precio no aceptables.' },
  { value: 'OTHER_OFFER', label: 'Se priorizó otra oferta o productor.' },
  { value: 'QUALITY', label: 'No cumple con los requisitos de calidad de la oferta.' },
  { value: 'LOGISTICS', label: 'Problemas de logística o ubicación.' },
  { value: 'OTHER', label: 'Otro motivo.' },
] as const;

export const defaultExpanded: Record<SectionKey, boolean> = {
  general: false,
  catch: false,
  packerNotes: false,
  logisticsTracking: false,
  settlement: false,
  settlementReadOnly: false,
  advanceTransfer: false,
  advanceReadOnly: false,
  balanceTransfer: false,
  balanceReadOnly: false,
  messages: false,
  rejectForm: false,
};

export const ADVANCE_DEADLINE_HOURS = 24;
export const BALANCE_DEADLINE_HOURS = 24;

/** Comisión por libra (oferta en lb) */
export const COMMISSION_PER_LB = 0.01;
/** Comisión por kg en USD (oferta en kg) */
export const COMMISSION_PER_KG = 0.02;
/** 1 lb en kg */
export const LB_TO_KG = 0.453592;

export const DUMMY_ADVANCE_PROOF_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="#e2e8f0"/><text x="160" y="85" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">Comprobante de anticipo</text><text x="160" y="105" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">(imagen de ejemplo)</text></svg>'
  );

export const DUMMY_BALANCE_PROOF_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="#e2e8f0"/><text x="160" y="85" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">Comprobante de saldo</text><text x="160" y="105" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">(imagen de ejemplo)</text></svg>'
  );
