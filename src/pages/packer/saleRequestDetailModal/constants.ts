import type { SectionKey } from './types';

export const MAX_MESSAGE_LENGTH = 500;

/** Tab labels for the detail modal (by SectionKey) */
export const SECTION_LABELS: Record<SectionKey, string> = {
  general: 'General Information',
  catch: 'Catch Information',
  possibleValueFinal: 'Possible final value',
  logisticsTracking: 'Logistics',
  settlement: 'Catch settlement',
  settlementReadOnly: 'Catch settlement',
  advanceTransfer: 'Advance transfer',
  advanceReadOnly: 'Advance paid',
  balanceTransfer: 'Balance payment',
  balanceReadOnly: 'Balance paid',
  messages: 'Messages',
  rejectForm: 'Rejection reason',
};

/** Rejection reason dropdown options (packer chooses when rejecting) */
export const REJECTION_REASONS = [
  { value: '', label: 'Select a reason...' },
  { value: 'SIZE_RANGE', label: 'Does not meet the size range required for this offer.' },
  { value: 'NO_CAPACITY', label: 'No processing capacity on the indicated date.' },
  { value: 'PRICE', label: 'Price terms not acceptable.' },
  { value: 'OTHER_OFFER', label: 'Another offer or producer was prioritized.' },
  { value: 'QUALITY', label: 'Does not meet the quality requirements of the offer.' },
  { value: 'LOGISTICS', label: 'Logistics or location issues.' },
  { value: 'OTHER', label: 'Other reason.' },
] as const;

export const defaultExpanded: Record<SectionKey, boolean> = {
  general: false,
  catch: false,
  possibleValueFinal: false,
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
