import React, { RefObject } from 'react';
import type { SaleRequest, ProducerBankAccount } from '../../../types';
import { collapsible, button, saleRequestDetail } from '../../../styles';
import type { Offer } from '../../../types';
import { normalizeSettlement } from './utils';
import { CollapsibleSection } from './CollapsibleSection';
import { BALANCE_DEADLINE_HOURS, COMMISSION_PER_LB, COMMISSION_PER_KG, LB_TO_KG } from './constants';
import { PACKER_BANK_ACCOUNTS } from '../../../data/packerBankAccounts';

type SettlementInput = Parameters<typeof normalizeSettlement>[0];

interface BalanceTransferSectionProps {
  request: SaleRequest;
  linkedOffer: Offer | null;
  expanded?: boolean;
  onToggle?: () => void;
  contentOnly?: boolean;
  balancePaymentEndsAt: number | null;
  balanceTimerTick: number;
  selectedBankIndex: number;
  onSelectedBankIndexChange: (index: number) => void;
  balanceProofFile: File | null;
  onBalanceProofFileChange: (file: File | null) => void;
  balanceProofPreviewUrl: string | null;
  balanceProofInputRef: RefObject<HTMLInputElement>;
}

export const BalanceTransferSection: React.FC<BalanceTransferSectionProps> = ({
  request,
  linkedOffer,
  expanded = false,
  onToggle = () => {},
  contentOnly = false,
  balancePaymentEndsAt,
  balanceTimerTick,
  selectedBankIndex,
  onSelectedBankIndexChange,
  balanceProofFile,
  onBalanceProofFileChange,
  balanceProofPreviewUrl,
  balanceProofInputRef,
}) => {
  const settlementForBalance = request.catchSettlement
    ? normalizeSettlement(request.catchSettlement as SettlementInput)
    : null;
  const allLines = settlementForBalance
    ? [...settlementForBalance.colaDirectaALines, ...settlementForBalance.colaDirectaBLines, ...settlementForBalance.ventaLocalLines]
    : [];
  const totalValor = allLines.reduce((sum, l) => sum + l.pounds * l.unitPrice, 0);
  const procesadasRealesLb = allLines.reduce((sum, l) => sum + l.pounds, 0);
  const priceUnit = linkedOffer?.priceUnit ?? 'PER_LB';
  const unitLabel = priceUnit === 'PER_KG' ? 'kg' : 'lb';
  const commissionUnitRate = priceUnit === 'PER_KG' ? COMMISSION_PER_KG : COMMISSION_PER_LB;
  const totalCommission =
    priceUnit === 'PER_KG'
      ? procesadasRealesLb * LB_TO_KG * COMMISSION_PER_KG
      : procesadasRealesLb * COMMISSION_PER_LB;
  const activeTiers = linkedOffer?.priceTiers.filter((t) => t.isActive && t.price > 0) ?? [];
  const sizeRange = request.catchInfo?.sizeRange ?? { min: 0, max: 0 };
  const matchingTier = activeTiers.find((t) => t.sizeMin === sizeRange.min && t.sizeMax === sizeRange.max);
  const estimatedQuantityLb = request.catchInfo?.estimatedQuantityLb ?? 0;
  const totalValorAdvance = matchingTier ? matchingTier.price * estimatedQuantityLb : 0;
  const advanceTerm = linkedOffer?.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const advancePercent = advanceTerm?.percent ?? 0;
  const advanceAmount = (advancePercent / 100) * totalValorAdvance;
  const quantityForAdvance =
    priceUnit === 'PER_KG'
      ? estimatedQuantityLb * LB_TO_KG * (advancePercent / 100)
      : estimatedQuantityLb * (advancePercent / 100);
  const commissionAmountAdvance =
    priceUnit === 'PER_KG' ? quantityForAdvance * COMMISSION_PER_KG : quantityForAdvance * COMMISSION_PER_LB;
  const valorPagadoAnticipo = advanceAmount + commissionAmountAdvance;
  const subtotalConComision = totalValor + totalCommission;
  const balanceAmount = Math.max(0, subtotalConComision - valorPagadoAnticipo);
  const remainingBalanceMs = balancePaymentEndsAt ? Math.max(0, balancePaymentEndsAt - Date.now()) : 0;
  const totalBalanceSeconds = Math.floor(remainingBalanceMs / 1000);
  const balanceHours = Math.floor(totalBalanceSeconds / 3600);
  const balanceMinutes = Math.floor((totalBalanceSeconds % 3600) / 60);
  const balanceSeconds = totalBalanceSeconds % 60;
  const formatTwoBalance = (n: number) => n.toString().padStart(2, '0');
  const isBalanceExpired = balancePaymentEndsAt != null && remainingBalanceMs === 0;

  const bankAccounts = PACKER_BANK_ACCOUNTS;
  const safeBankIndex = selectedBankIndex >= bankAccounts.length ? 0 : selectedBankIndex;
  const account = bankAccounts[safeBankIndex] as ProducerBankAccount | undefined;

  const content = (
      <div className={collapsible.content}>
        <div className={saleRequestDetail.sectionCard}>
          <div
            className={isBalanceExpired ? collapsible.timerExpired : collapsible.timerActive}
          >
            <p className={collapsible.timerLabel}>
              Plazo para pagar el saldo restante
            </p>
            <p className={collapsible.timerHelp}>
              Tiene {BALANCE_DEADLINE_HOURS} horas para realizar la transferencia y subir la prueba.
            </p>
            {isBalanceExpired ? (
              <p className={collapsible.timerTextExpired}>Tiempo agotado</p>
            ) : (
              <>
                <p className={collapsible.timerDigits} aria-live="polite">
                  {formatTwoBalance(balanceHours)}:{formatTwoBalance(balanceMinutes)}:
                  {formatTwoBalance(balanceSeconds)}
                </p>
                <span className="sr-only" aria-hidden>
                  {balanceTimerTick}
                </span>
              </>
            )}
          </div>

          <div className="space-y-4">
            <h4 className={collapsible.subsectionTitle}>
              Información bancaria de la empacadora
            </h4>
            {bankAccounts.length > 0 ? (
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
                    {bankAccounts.map((acc, idx) => (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <p className={collapsible.fieldLabel}>Banco</p>
                        <p className={collapsible.fieldValue}>{account.bankName}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>Tipo de cuenta</p>
                        <p className="text-gray-900">{account.accountType}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>Número de cuenta</p>
                        <p className="text-gray-900 font-semibold tabular-nums">{account.accountNumber}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>Titular</p>
                        <p className={collapsible.fieldValue}>{account.accountHolderName}</p>
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
                No bank data registered for the packer.
              </p>
            )}
          </div>

          <div className={collapsible.transferBox}>
            <h4 className={collapsible.subsectionTitleMb}>
              Datos para la transferencia del saldo restante
            </h4>
            <div className={saleRequestDetail.gridFormDense}>
              <div>
                <p className={collapsible.fieldLabel}>Beneficiario (productor)</p>
                <p className={saleRequestDetail.fieldValue}>{request.producerName}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Concepto</p>
                <p className={saleRequestDetail.fieldValueText}>Saldo restante por compra de pesca</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Procesadas reales de liquidación de pesca</p>
                <p className={saleRequestDetail.fieldValueSemibold}>
                  {priceUnit === 'PER_KG' ? (procesadasRealesLb * LB_TO_KG).toFixed(2) : procesadasRealesLb.toFixed(2)} {unitLabel}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Precio de comisión unitario</p>
                <p className={saleRequestDetail.fieldValueText}>
                  $ {commissionUnitRate.toFixed(3)} / {unitLabel}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Total comisión (procesadas × comisión)</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {totalCommission.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor total (liquidación)</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {totalValor.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor final cancelado del anticipo</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {valorPagadoAnticipo.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Subtotal (liquidación + comisión)</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {subtotalConComision.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor a pagar (subtotal − anticipo cancelado)</p>
                <p className={saleRequestDetail.amountHighlight}>$ {balanceAmount.toFixed(2)}</p>
              </div>
            </div>
            <p className={saleRequestDetail.transferHelp}>
              Realice la transferencia del saldo según los datos acordados con el productor y adjunte la prueba
              de pago abajo.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className={collapsible.subsectionTitle}>
              Prueba del pago del saldo
            </h4>
            <input
              ref={balanceProofInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith('image/')) onBalanceProofFileChange(file);
                e.target.value = '';
              }}
            />
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => requestAnimationFrame(() => balanceProofInputRef.current?.click())}
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
                {balanceProofFile && (
                  <>
                    <span className={saleRequestDetail.fileName}>{balanceProofFile.name}</span>
                    <button
                      type="button"
                      onClick={() => onBalanceProofFileChange(null)}
                      className={button.linkRemove}
                    >
                      Quitar
                    </button>
                  </>
                )}
              </div>
              {balanceProofPreviewUrl && (
                <div className={collapsible.proofImageLg}>
                  <img
                    src={balanceProofPreviewUrl}
                    alt="Vista previa del comprobante de saldo"
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
      title="Pago del saldo restante al productor"
      expanded={expanded}
      onToggle={onToggle}
    >
      {content}
    </CollapsibleSection>
  );
};
