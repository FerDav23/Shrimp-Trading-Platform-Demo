import React from 'react';
import type { SaleRequestStatus } from '../../../types';
import { detailActions, button } from '../../../styles';

interface DetailActionsProps {
  status: SaleRequestStatus;
  showRejectForm: boolean;
  canConfirmReject: boolean;
  isSettlementLocked: boolean;
  advanceProofFile: File | null;
  balanceProofFile: File | null;
  onClose: () => void;
  /** Al hacer clic en "Aceptar" se muestra el paso de confirmación (términos y condiciones) */
  onStartAccept?: () => void;
  onAccept: () => void;
  onReject: () => void;
  onCancelReject: () => void;
  onSendSettlement?: () => void;
  onCancelPurchase?: () => void;
  onSendAdvanceProof?: () => void;
  onSendBalanceProof?: () => void;
  /** Al aceptar la cotización de logística (estado LOGISTICS_QUOTE_PENDING_ACCEPTANCE) */
  onAcceptLogisticsQuote?: () => void;
}

export const DetailActions: React.FC<DetailActionsProps> = ({
  status,
  showRejectForm,
  canConfirmReject,
  isSettlementLocked,
  advanceProofFile,
  balanceProofFile,
  onClose,
  onStartAccept,
  onAccept,
  onReject,
  onCancelReject,
  onSendSettlement,
  onCancelPurchase,
  onSendAdvanceProof,
  onSendBalanceProof,
  onAcceptLogisticsQuote,
}) => (
  <div className={detailActions.container}>
    {status === 'LOGISTICS_QUOTE_IN_PROGRESS' && (
      <button type="button" onClick={onClose} className={detailActions.close}>
        Cerrar
      </button>
    )}
    {status === 'LOGISTICS_QUOTE_PENDING_ACCEPTANCE' && !showRejectForm && (
      <>
        <button type="button" onClick={onClose} className={detailActions.cancel}>
          Cerrar
        </button>
        <button type="button" onClick={onReject} className={detailActions.reject}>
          Rechazar cotización
        </button>
        <button
          type="button"
          onClick={onAcceptLogisticsQuote}
          className={detailActions.accept}
        >
          Aceptar cotización
        </button>
      </>
    )}
    {status === 'LOGISTICS_QUOTE_PENDING_ACCEPTANCE' && showRejectForm && (
      <>
        <button type="button" onClick={onCancelReject} className={detailActions.cancel}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={!canConfirmReject}
          className={detailActions.rejectDisabled}
        >
          Confirmar rechazo de cotización
        </button>
      </>
    )}
    {status === 'PENDING_ACCEPTANCE' && !showRejectForm && (
      <>
        <button type="button" onClick={onClose} className={detailActions.cancel}>
          Cerrar
        </button>
        <button type="button" onClick={onReject} className={detailActions.reject}>
          Rechazar solicitud de compra
        </button>
        <button
          type="button"
          onClick={onStartAccept ?? onAccept}
          className={detailActions.accept}
        >
          Aceptar solicitud de compra
        </button>
      </>
    )}
    {status === 'PENDING_ACCEPTANCE' && showRejectForm && (
      <>
        <button type="button" onClick={onCancelReject} className={detailActions.cancel}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={!canConfirmReject}
          className={detailActions.rejectDisabled}
        >
          Confirmar rechazo de solicitud de compra
        </button>
      </>
    )}
    {status !== 'PENDING_ACCEPTANCE' &&
      status !== 'LOGISTICS_QUOTE_IN_PROGRESS' &&
      status !== 'LOGISTICS_QUOTE_PENDING_ACCEPTANCE' && (
      <>
        <button type="button" onClick={onClose} className={detailActions.close}>
          Cerrar
        </button>
        {status === 'CATCH_SETTLEMENT_PENDING' && (
          <>
            {onSendSettlement && (
              <button
                type="button"
                onClick={onSendSettlement}
                disabled={!isSettlementLocked}
                className={button.skyPrimary}
              >
                Enviar liquidación de pesca
              </button>
            )}
            {onCancelPurchase && (
              <button
                type="button"
                onClick={onCancelPurchase}
                className={button.rejectOutline}
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
                className={button.skyPrimary}
              >
                Enviar prueba de anticipo
              </button>
            )}
            {onCancelPurchase && (
              <button
                type="button"
                onClick={onCancelPurchase}
                className={button.rejectOutline}
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
                className={button.skyPrimary}
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
