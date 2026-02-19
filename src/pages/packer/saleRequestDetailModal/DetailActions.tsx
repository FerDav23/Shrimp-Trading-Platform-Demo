import React from 'react';
import type { SaleRequestStatus } from '../../../types';

interface DetailActionsProps {
  status: SaleRequestStatus;
  showRejectForm: boolean;
  canConfirmReject: boolean;
  isSettlementLocked: boolean;
  advanceProofFile: File | null;
  balanceProofFile: File | null;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  onCancelReject: () => void;
  onSendSettlement?: () => void;
  onCancelPurchase?: () => void;
  onSendAdvanceProof?: () => void;
  onSendBalanceProof?: () => void;
}

export const DetailActions: React.FC<DetailActionsProps> = ({
  status,
  showRejectForm,
  canConfirmReject,
  isSettlementLocked,
  advanceProofFile,
  balanceProofFile,
  onClose,
  onAccept,
  onReject,
  onCancelReject,
  onSendSettlement,
  onCancelPurchase,
  onSendAdvanceProof,
  onSendBalanceProof,
}) => (
  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
    {status === 'PENDING_ACCEPTANCE' && !showRejectForm && (
      <>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          Cerrar
        </button>
        <button
          type="button"
          onClick={onReject}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
        >
          Rechazar solicitud de compra
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors"
        >
          Aceptar solicitud de compra
        </button>
      </>
    )}
    {status === 'PENDING_ACCEPTANCE' && showRejectForm && (
      <>
        <button
          type="button"
          onClick={onCancelReject}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={!canConfirmReject}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmar rechazo de solicitud de compra
        </button>
      </>
    )}
    {status !== 'PENDING_ACCEPTANCE' && (
      <>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors"
        >
          Cerrar
        </button>
        {status === 'CATCH_SETTLEMENT_PENDING' && (
          <>
            {onSendSettlement && (
              <button
                type="button"
                onClick={onSendSettlement}
                disabled={!isSettlementLocked}
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-600"
              >
                Enviar liquidación de pesca
              </button>
            )}
            {onCancelPurchase && (
              <button
                type="button"
                onClick={onCancelPurchase}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 font-medium transition-colors"
              >
                Cancelar compra
              </button>
            )}
          </>
        )}
        {status === 'ADVANCE_PENDING' && (
          <>
            {onSendAdvanceProof && (
              <button
                type="button"
                onClick={onSendAdvanceProof}
                disabled={!advanceProofFile}
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-600"
              >
                Enviar prueba de anticipo
              </button>
            )}
            {onCancelPurchase && (
              <button
                type="button"
                onClick={onCancelPurchase}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 font-medium transition-colors"
              >
                Cancelar compra
              </button>
            )}
          </>
        )}
        {status === 'BALANCE_PENDING' && (
          <>
            {onSendBalanceProof && (
              <button
                type="button"
                onClick={onSendBalanceProof}
                disabled={!balanceProofFile}
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-600"
              >
                Enviar prueba de saldo
              </button>
            )}
          </>
        )}
      </>
    )}
  </div>
);
