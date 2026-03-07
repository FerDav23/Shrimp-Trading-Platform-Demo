import type { SaleRequest, SaleRequestStatus } from '../../../types';

export interface SaleRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: SaleRequest | null;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string, reason?: string, notes?: string) => void;
  /** Motivos de rechazo guardados por el parent (para mostrar en solicitudes rechazadas) */
  rejectionReasons?: Record<string, string>;
  onSendSettlement?: (requestId: string) => void;
  onCancelPurchase?: (requestId: string) => void;
  onSendAdvanceProof?: (requestId: string) => void;
  onSendBalanceProof?: (requestId: string) => void;
  onConfirmDelivery?: (requestId: string, data: import('../../../types').LogisticsDeliveryConfirm) => void;
  onRejectLogisticsQuote?: (requestId: string, reason?: string, notes?: string) => void;
  onAcceptLogisticsQuote?: (requestId: string) => void;
}

export type SectionKey =
  | 'general'
  | 'catch'
  | 'possibleValueFinal'
  | 'logisticsTracking'
  | 'settlement'
  | 'settlementReadOnly'
  | 'advanceTransfer'
  | 'advanceReadOnly'
  | 'balanceTransfer'
  | 'balanceReadOnly'
  | 'messages'
  | 'rejectForm';

export type { SaleRequest, SaleRequestStatus };
