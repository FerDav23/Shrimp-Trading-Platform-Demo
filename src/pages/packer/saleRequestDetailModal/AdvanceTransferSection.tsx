import React, { RefObject } from 'react';
import type { SaleRequest, ProducerBankAccount } from '../../../types';
import { collapsible, button, saleRequestDetail } from '../../../styles';
import type { Offer } from '../../../types';
import { normalizeSettlement } from './utils';
import { CollapsibleSection } from './CollapsibleSection';
import { ADVANCE_DEADLINE_HOURS } from './constants';

type SettlementInput = Parameters<typeof normalizeSettlement>[0];

interface AdvanceTransferSectionProps {
  request: SaleRequest;
  linkedOffer: Offer | null;
  expanded?: boolean;
  onToggle?: () => void;
  contentOnly?: boolean;
  advancePaymentEndsAt: number | null;
  advanceTimerTick: number;
  selectedBankIndex: number;
  onSelectedBankIndexChange: (index: number) => void;
  advanceProofFile: File | null;
  onAdvanceProofFileChange: (file: File | null) => void;
  advanceProofPreviewUrl: string | null;
  advanceProofInputRef: RefObject<HTMLInputElement>;
}

export const AdvanceTransferSection: React.FC<AdvanceTransferSectionProps> = ({
  request,
  linkedOffer,
  expanded = false,
  onToggle = () => {},
  contentOnly = false,
  advancePaymentEndsAt,
  advanceTimerTick,
  selectedBankIndex,
  onSelectedBankIndexChange,
  advanceProofFile,
  onAdvanceProofFileChange,
  advanceProofPreviewUrl,
  advanceProofInputRef,
}) => {
  const settlementForAdvance = request.catchSettlement
    ? normalizeSettlement(request.catchSettlement as SettlementInput)
    : null;
  const totalValor = settlementForAdvance
    ? [...settlementForAdvance.colaDirectaALines, ...settlementForAdvance.colaDirectaBLines, ...settlementForAdvance.ventaLocalLines].reduce(
        (sum, l) => sum + l.pounds * l.unitPrice,
        0
      )
    : 0;
  const advanceTerm = linkedOffer?.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const advancePercent = advanceTerm?.percent ?? 0;
  const advanceAmount = (advancePercent / 100) * totalValor;
  const now = Date.now();
  const remainingMs = advancePaymentEndsAt ? Math.max(0, advancePaymentEndsAt - now) : 0;
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formatTwo = (n: number) => n.toString().padStart(2, '0');
  const isExpired = advancePaymentEndsAt != null && remainingMs === 0;

  const producerBankAccounts = request.producerBankAccounts ?? [];
  const safeBankIndex = selectedBankIndex >= producerBankAccounts.length ? 0 : selectedBankIndex;
  const account = producerBankAccounts[safeBankIndex] as ProducerBankAccount | undefined;

  const content = (
      <div className={collapsible.content}>
        <div className={saleRequestDetail.sectionCard}>
          <div
            className={isExpired ? collapsible.timerExpired : collapsible.timerActive}
          >
            <p className={`${collapsible.fieldLabel} mb-1`}>
              Plazo para pagar el anticipo
            </p>
            <p className={collapsible.timerHelp}>
              Tiene {ADVANCE_DEADLINE_HOURS} horas para realizar la transferencia y subir la prueba.
            </p>
            {isExpired ? (
              <p className={collapsible.timerTextExpired}>Tiempo agotado</p>
            ) : (
              <>
                <p className={collapsible.timerDigits} aria-live="polite">
                  {formatTwo(hours)}:{formatTwo(minutes)}:{formatTwo(seconds)}
                </p>
                <span className="sr-only" aria-hidden>
                  {advanceTimerTick}
                </span>
              </>
            )}
          </div>

          <div className="space-y-4">
            <h4 className={collapsible.subsectionTitle}>
              Información del productor
            </h4>
            <div>
              <p className={collapsible.fieldLabelMb1}>Productor</p>
              <p className="text-base text-gray-900 font-medium leading-snug">{request.producerName}</p>
            </div>
            {producerBankAccounts.length > 0 ? (
              <>
                <div>
                  <label className={`block ${collapsible.fieldLabel} mb-2`}>
                    Banco para transferencia
                  </label>
                  <select
                    value={safeBankIndex}
                    onChange={(e) => onSelectedBankIndexChange(Number(e.target.value))}
                    className={collapsible.selectSky}
                  >
                    {producerBankAccounts.map((acc, idx) => (
                      <option key={idx} value={idx}>
                        {acc.bankName}
                      </option>
                    ))}
                  </select>
                </div>
                {account && (
                  <div className={collapsible.bankCard}>
                    <h5 className={collapsible.bankCardTitle}>
                      Datos de la cuenta seleccionada
                    </h5>
                    <div className={saleRequestDetail.gridFormDense}>
                      <div>
                        <p className={collapsible.fieldLabel}>Banco</p>
                        <p className={saleRequestDetail.fieldValue}>{account.bankName}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>Tipo de cuenta</p>
                        <p className={saleRequestDetail.fieldValueText}>{account.accountType}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>Número de cuenta</p>
                        <p className={saleRequestDetail.fieldValueSemibold}>{account.accountNumber}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>Titular</p>
                        <p className={saleRequestDetail.fieldValue}>{account.accountHolderName}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>Cédula / Identificación</p>
                        <p className="text-gray-900 tabular-nums">{account.identification}</p>
                      </div>
                      {account.email && (
                        <div className="md:col-span-2">
                          <p className={collapsible.fieldLabel}>Correo</p>
                          <p className="text-gray-900">{account.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className={saleRequestDetail.noBankData}>
                No hay datos bancarios registrados para este productor.
              </p>
            )}
          </div>

          <div className={collapsible.transferBox}>
            <h4 className={collapsible.subsectionTitleMb}>
              Datos para la transferencia del anticipo
            </h4>
            <div className={saleRequestDetail.gridFormDense}>
              <div>
                <p className={collapsible.fieldLabel}>Beneficiario (productor)</p>
                <p className={saleRequestDetail.fieldValue}>{request.producerName}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>ID Solicitud</p>
                <p className={saleRequestDetail.fieldValueSemibold}>#{request.id.split('-')[1]}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Concepto</p>
                <p className={saleRequestDetail.fieldValueText}>Anticipo por compra de pesca</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor total (liquidación)</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {totalValor.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Porcentaje de anticipo (oferta)</p>
                <p className="text-gray-900 tabular-nums">{advancePercent}%</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Monto del anticipo</p>
                <p className={saleRequestDetail.amountHighlight}>$ {advanceAmount.toFixed(2)}</p>
              </div>
            </div>
            <p className={saleRequestDetail.transferHelp}>
              Realice la transferencia según los datos acordados con el productor y adjunte la prueba de pago
              abajo.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className={collapsible.subsectionTitle}>
              Prueba del anticipo
            </h4>
            <input
              ref={advanceProofInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith('image/')) onAdvanceProofFileChange(file);
                e.target.value = '';
              }}
            />
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => requestAnimationFrame(() => advanceProofInputRef.current?.click())}
                  className={button.skyUpload}
                >
                  <svg
                    className={saleRequestDetail.iconMd}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Subir imagen
                </button>
                {advanceProofFile && (
                  <>
                    <span className={saleRequestDetail.fileName}>{advanceProofFile.name}</span>
                    <button
                      type="button"
                      onClick={() => onAdvanceProofFileChange(null)}
                      className={button.linkRemove}
                    >
                      Quitar
                    </button>
                  </>
                )}
              </div>
              {advanceProofPreviewUrl && (
                <div className={collapsible.proofImageLg}>
                  <img
                    src={advanceProofPreviewUrl}
                    alt="Vista previa del comprobante"
                    className={collapsible.proofImg}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
  if (contentOnly) return content;
  return (
    <CollapsibleSection
      title="Transferencia de anticipo al productor"
      expanded={expanded}
      onToggle={onToggle}
    >
      {content}
    </CollapsibleSection>
  );
};
