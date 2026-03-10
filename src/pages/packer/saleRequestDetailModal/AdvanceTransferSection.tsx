import React, { RefObject } from 'react';
import type { SaleRequest, ProducerBankAccount } from '../../../types';
import { collapsible, button, saleRequestDetail } from '../../../styles';
import type { Offer } from '../../../types';
import { CollapsibleSection } from './CollapsibleSection';
import { ADVANCE_DEADLINE_HOURS, COMMISSION_PER_LB, COMMISSION_PER_KG, LB_TO_KG } from './constants';
import { PACKER_BANK_ACCOUNTS } from '../../../data/packerBankAccounts';


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
  const estimatedQuantityLb = request.catchInfo.estimatedQuantityLb;
  const sizeRange = request.catchInfo.sizeRange;
  const activeTiers = linkedOffer?.priceTiers.filter((t) => t.isActive && t.price > 0) ?? [];
  const matchingTier = activeTiers.find(
    (t) => t.sizeMin === sizeRange.min && t.sizeMax === sizeRange.max
  );

  const advanceTerm = linkedOffer?.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const advancePercent = advanceTerm?.percent ?? 0;
  const priceUnit = linkedOffer?.priceUnit ?? 'PER_LB';
  const estimatedLotWeight =
    priceUnit === 'PER_KG' ? estimatedQuantityLb * LB_TO_KG : estimatedQuantityLb;
  const lotWeight = request.logisticsDelivery?.catchWeight ?? estimatedLotWeight;
  const commissionAmount =
    priceUnit === 'PER_KG' ? lotWeight * COMMISSION_PER_KG * (advancePercent / 100) : lotWeight * COMMISSION_PER_LB * (advancePercent / 100);
  const unitLabel = priceUnit === 'PER_KG' ? 'kg' : 'lb';

  /** Peso de la pesca: igual al peso de la pesca recibida (LogisticsTrackingSection) cuando existe */

  const unitPriceTalla = matchingTier ? matchingTier.price : 0;
  const commissionUnitRate = priceUnit === 'PER_KG' ? COMMISSION_PER_KG : COMMISSION_PER_LB;
  const totalValor = matchingTier ? matchingTier.price * lotWeight : 0;
  const advanceAmount = (advancePercent / 100) * totalValor;
  const totalToPay = advanceAmount + commissionAmount;
  const now = Date.now();
  const remainingMs = advancePaymentEndsAt ? Math.max(0, advancePaymentEndsAt - now) : 0;
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formatTwo = (n: number) => n.toString().padStart(2, '0');
  const isExpired = advancePaymentEndsAt != null && remainingMs === 0;

  const bankAccounts = PACKER_BANK_ACCOUNTS;
  const safeBankIndex = selectedBankIndex >= bankAccounts.length ? 0 : selectedBankIndex;
  const account = bankAccounts[safeBankIndex] as ProducerBankAccount | undefined;

  const content = (
      <div className={collapsible.content}>
        <div className={saleRequestDetail.sectionCard}>
          <div
            className={isExpired ? collapsible.timerExpired : collapsible.timerActive}
          >
            <p className={`${collapsible.fieldLabel} mb-1`}>
              Deadline to pay the advance
            </p>
            <p className={collapsible.timerHelp}>
              You have {ADVANCE_DEADLINE_HOURS} hours to make the transfer and upload the proof.
            </p>
            {isExpired ? (
              <p className={collapsible.timerTextExpired}>Time expired</p>
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
              Packer bank information
            </h4>
            {bankAccounts.length > 0 ? (
              <>
                <div>
                  <label className={`block ${collapsible.fieldLabel} mb-2`}>
                    Bank for transfer
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
                      Selected account details
                    </h5>
                    <div className={saleRequestDetail.gridFormDense}>
                      <div>
                        <p className={collapsible.fieldLabel}>Bank</p>
                        <p className={saleRequestDetail.fieldValue}>{account.bankName}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>Account type</p>
                        <p className={saleRequestDetail.fieldValueText}>{account.accountType}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>Account number</p>
                        <p className={saleRequestDetail.fieldValueSemibold}>{account.accountNumber}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>Account holder</p>
                        <p className={saleRequestDetail.fieldValue}>{account.accountHolderName}</p>
                      </div>
                      <div>
                        <p className={collapsible.fieldLabel}>ID number</p>
                        <p className="text-gray-900 tabular-nums">{account.identification}</p>
                      </div>
                      {account.email && (
                        <div className="md:col-span-2">
                          <p className={collapsible.fieldLabel}>Email</p>
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
              Advance transfer details
            </h4>
            <div className={saleRequestDetail.gridFormDense}>
              <div>
                <p className={collapsible.fieldLabel}>Beneficiary (producer)</p>
                <p className={saleRequestDetail.fieldValue}>{request.producerName}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Concept</p>
                <p className={saleRequestDetail.fieldValueText}>Advance for catch purchase</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Catch weight</p>
                <p className={saleRequestDetail.fieldValueSemibold}>
                  {lotWeight.toFixed(2)} {unitLabel}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Unit price (size)</p>
                <p className={saleRequestDetail.fieldValueText}>
                  $ {unitPriceTalla.toFixed(2)} / {unitLabel}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Commission unit rate</p>
                <p className={saleRequestDetail.fieldValueText}>
                  $ {commissionUnitRate.toFixed(3)} / {unitLabel}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Total value (settlement)</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {totalValor.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Advance percentage (offer)</p>
                <p className="text-gray-900 tabular-nums">{advancePercent}%</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Advance amount</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {advanceAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Commission payment</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {commissionAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Final amount to pay</p>
                <p className={saleRequestDetail.amountHighlight}>$ {totalToPay.toFixed(2)}</p>
              </div>
            </div>
            <p className={saleRequestDetail.transferHelp}>
              Make the transfer according to the details agreed with the producer and attach the payment proof below.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className={collapsible.subsectionTitle}>
              Advance proof
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
                  Upload image
                </button>
                {advanceProofFile && (
                  <>
                    <span className={saleRequestDetail.fileName}>{advanceProofFile.name}</span>
                    <button
                      type="button"
                      onClick={() => onAdvanceProofFileChange(null)}
                      className={button.linkRemove}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
              {advanceProofPreviewUrl && (
                <div className={collapsible.proofImageLg}>
                  <img
                    src={advanceProofPreviewUrl}
                    alt="Proof preview"
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
      title="Advance transfer to producer"
      expanded={expanded}
      onToggle={onToggle}
    >
      {content}
    </CollapsibleSection>
  );
};
