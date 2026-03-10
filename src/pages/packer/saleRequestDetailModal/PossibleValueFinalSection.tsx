import React from 'react';
import { saleRequestDetail, messagesSection } from '../../../styles';
import type { SaleRequest } from '../../../types';
import type { Offer } from '../../../types';
import { getEstimatedCatchTotalFromOffer, getPriceTierForRequest } from './utils';
import { MAX_MESSAGE_LENGTH, LB_TO_KG } from './constants';

interface PossibleValueFinalSectionProps {
  request: SaleRequest;
  linkedOffer: Offer | null;
  contentOnly?: boolean;
  /** Para estado cotización pendiente de aceptar: permite enviar mensaje */
  messageText?: string;
  onMessageTextChange?: (value: string) => void;
  onSendMessage?: () => void;
}

/** Mensaje cuando la cotización de logística sigue en proceso */
const InProgressContent: React.FC = () => (
  <div className={saleRequestDetail.sectionCard}>
    <p className="text-sm text-gray-700 leading-relaxed">
      The logistics quote is still in progress. Once it is ready you will be notified of the
      possible amount to pay for the purchase.
    </p>
  </div>
);

/** Desglose: cantidad, precio talla, total pesca, logística, total a pagar + mensaje (estado cotización pendiente de aceptar) */
const PendingAcceptanceContent: React.FC<{
  request: SaleRequest;
  linkedOffer: Offer | null;
  messageText?: string;
  onMessageTextChange?: (value: string) => void;
  onSendMessage?: () => void;
}> = ({ request, linkedOffer, messageText = '', onMessageTextChange, onSendMessage }) => {
  const quote = request.logisticsQuote;
  const estimatedCatch =
    quote?.estimatedCatchTotalUSD ?? getEstimatedCatchTotalFromOffer(request, linkedOffer);
  const priceTier = getPriceTierForRequest(request, linkedOffer);
  const { estimatedQuantityLb, sizeRange } = request.catchInfo;

  return (
    <div className="space-y-4">
      <div className={saleRequestDetail.sectionCard}>
        <div className={`${saleRequestDetail.sectionGridTwoCols} gap-y-3`}>
          <div>
            <p className={saleRequestDetail.sectionLabelSm}>Estimated catch quantity</p>
            <p className={saleRequestDetail.sectionValueSm}>
              {estimatedQuantityLb.toLocaleString('es-EC')} lb
              {linkedOffer?.priceUnit === 'PER_KG' && (
                <span className="text-gray-500 ml-1">
                  ({(estimatedQuantityLb * LB_TO_KG).toLocaleString('es-EC', { maximumFractionDigits: 1 })} kg)
                </span>
              )}
            </p>
          </div>
          {priceTier && (
            <div>
              <p className={saleRequestDetail.sectionLabelSm}>Size price ({sizeRange.min}/{sizeRange.max})</p>
              <p className={saleRequestDetail.sectionValueSm}>
                USD {priceTier.price.toLocaleString('es-EC', { minimumFractionDigits: 2 })} / {priceTier.unit === 'PER_LB' ? 'lb' : 'kg'}
              </p>
            </div>
          )}
          {estimatedCatch != null && (
            <div>
              <p className={saleRequestDetail.sectionLabelSm}>Possible catch total</p>
              <p className={saleRequestDetail.sectionValueSm}>
                USD {estimatedCatch.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
          {quote && (
            <>
              <div>
                <p className={saleRequestDetail.sectionLabelSm}>Logistics</p>
                <p className={saleRequestDetail.sectionValueSm}>
                  USD {quote.logisticsAmountUSD.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className={saleRequestDetail.sectionLabelSm}>Total to pay</p>
                <p className={saleRequestDetail.amountHighlight}>
                  USD {quote.totalToPayUSD.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </>
          )}
          {estimatedCatch == null && quote && (
            <div>
              <p className={saleRequestDetail.sectionLabelSm}>Possible catch total</p>
              <p className={saleRequestDetail.sectionValueSm}>
                USD {quote.estimatedCatchTotalUSD.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>
      </div>

      {onSendMessage && onMessageTextChange !== undefined && (
        <div className={saleRequestDetail.sectionCard}>
          <p className={saleRequestDetail.sectionLabelSm}>Send us a message</p>
          <p className="text-sm text-gray-600 mb-2">
            If you have questions about the quote or want to comment, you can write to us here.
          </p>
          <div className={messagesSection.inputArea}>
            <div className={messagesSection.inputRow}>
              <textarea
                value={messageText}
                onChange={(e) => onMessageTextChange(e.target.value)}
                placeholder="Write your message..."
                className={messagesSection.textarea}
                rows={3}
                maxLength={MAX_MESSAGE_LENGTH}
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
              {messageText.length} / {MAX_MESSAGE_LENGTH}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PossibleValueFinalSection: React.FC<PossibleValueFinalSectionProps> = ({
  request,
  linkedOffer,
  contentOnly = false,
  messageText,
  onMessageTextChange,
  onSendMessage,
}) => {
  const isInProgress = request.status === 'LOGISTICS_QUOTE_IN_PROGRESS';
  const isPendingAcceptance = request.status === 'LOGISTICS_QUOTE_PENDING_ACCEPTANCE';

  if (!isInProgress && !isPendingAcceptance) return null;

  return isInProgress ? (
    <InProgressContent />
  ) : (
    <PendingAcceptanceContent
      request={request}
      linkedOffer={linkedOffer}
      messageText={messageText}
      onMessageTextChange={onMessageTextChange}
      onSendMessage={onSendMessage}
    />
  );
};
