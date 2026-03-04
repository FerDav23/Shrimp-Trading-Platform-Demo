import React from 'react';
import type { SaleRequest } from '../../../types';
import { collapsible, saleRequestDetail } from '../../../styles';
import { normalizeSettlement } from './utils';
import { CollapsibleSection } from './CollapsibleSection';
import { DUMMY_BALANCE_PROOF_IMAGE, COMMISSION_PER_LB, COMMISSION_PER_KG, LB_TO_KG } from './constants';
import type { Offer } from '../../../types';
import { PACKER_BANK_ACCOUNTS } from '../../../data/packerBankAccounts';

type SettlementInput = Parameters<typeof normalizeSettlement>[0];

interface BalanceReadOnlySectionProps {
  request: SaleRequest;
  linkedOffer: Offer | null;
  expanded?: boolean;
  onToggle?: () => void;
  contentOnly?: boolean;
}

export const BalanceReadOnlySection: React.FC<BalanceReadOnlySectionProps> = ({
  request,
  linkedOffer,
  expanded = false,
  onToggle = () => {},
  contentOnly = false,
}) => {
  const settlementForReadOnly = request.catchSettlement
    ? normalizeSettlement(request.catchSettlement as SettlementInput)
    : null;
  const allLinesRO = settlementForReadOnly
    ? [...settlementForReadOnly.colaDirectaALines, ...settlementForReadOnly.colaDirectaBLines, ...settlementForReadOnly.ventaLocalLines]
    : [];
  const totalValorRO = allLinesRO.reduce((sum, l) => sum + l.pounds * l.unitPrice, 0);
  const procesadasRealesLbRO = allLinesRO.reduce((sum, l) => sum + l.pounds, 0);
  const priceUnitRO = linkedOffer?.priceUnit ?? 'PER_LB';
  const unitLabelRO = priceUnitRO === 'PER_KG' ? 'kg' : 'lb';
  const commissionUnitRateRO = priceUnitRO === 'PER_KG' ? COMMISSION_PER_KG : COMMISSION_PER_LB;
  const totalCommissionRO =
    priceUnitRO === 'PER_KG'
      ? procesadasRealesLbRO * LB_TO_KG * COMMISSION_PER_KG
      : procesadasRealesLbRO * COMMISSION_PER_LB;
  const activeTiersRO = linkedOffer?.priceTiers.filter((t) => t.isActive && t.price > 0) ?? [];
  const sizeRangeRO = request.catchInfo?.sizeRange ?? { min: 0, max: 0 };
  const matchingTierRO = activeTiersRO.find((t) => t.sizeMin === sizeRangeRO.min && t.sizeMax === sizeRangeRO.max);
  const estimatedQuantityLbRO = request.catchInfo?.estimatedQuantityLb ?? 0;
  const totalValorAdvanceRO = matchingTierRO ? matchingTierRO.price * estimatedQuantityLbRO : 0;
  const advanceTermRO = linkedOffer?.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const advancePercentRO = advanceTermRO?.percent ?? 0;
  const advanceAmountRO = (advancePercentRO / 100) * totalValorAdvanceRO;
  const quantityForAdvanceRO =
    priceUnitRO === 'PER_KG'
      ? estimatedQuantityLbRO * LB_TO_KG * (advancePercentRO / 100)
      : estimatedQuantityLbRO * (advancePercentRO / 100);
  const commissionAmountAdvanceRO =
    priceUnitRO === 'PER_KG' ? quantityForAdvanceRO * COMMISSION_PER_KG : quantityForAdvanceRO * COMMISSION_PER_LB;
  const valorPagadoAnticipoRO = advanceAmountRO + commissionAmountAdvanceRO;
  const subtotalConComisionRO = totalValorRO + totalCommissionRO;
  const balanceAmountRO = Math.max(0, subtotalConComisionRO - valorPagadoAnticipoRO);
  const firstAccount = PACKER_BANK_ACCOUNTS[0];

  const content = (
      <div className={collapsible.content}>
        <div className={saleRequestDetail.sectionCard}>
          <div className="space-y-4">
            <h4 className={collapsible.subsectionTitle}>
              Información bancaria de la empacadora
            </h4>
            <div>
              <p className={collapsible.fieldLabelMb1}>Empacadora</p>
              <p className="text-base text-gray-900 font-medium leading-snug">
                {linkedOffer?.packingCompany.name ?? 'Empacadora'}
              </p>
            </div>
            {firstAccount && (
              <div className={collapsible.bankCard}>
                <h5 className={collapsible.bankCardTitle}>
                  Datos de la cuenta utilizada
                </h5>
                <div className={saleRequestDetail.gridFormDense}>
                  <div>
                    <p className={collapsible.fieldLabel}>Banco</p>
                    <p className={saleRequestDetail.fieldValue}>{firstAccount.bankName}</p>
                  </div>
                  <div>
                    <p className={collapsible.fieldLabel}>Número de cuenta</p>
                    <p className={saleRequestDetail.fieldValueSemibold}>{firstAccount.accountNumber}</p>
                  </div>
                  <div>
                    <p className={collapsible.fieldLabel}>Titular</p>
                    <p className={saleRequestDetail.fieldValue}>{firstAccount.accountHolderName}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={collapsible.transferBox}>
            <h4 className={collapsible.subsectionTitleMb}>
              Resumen del pago del saldo
            </h4>
            <div className={saleRequestDetail.gridFormDense}>
              <div>
                <p className={collapsible.fieldLabel}>Beneficiario</p>
                <p className={saleRequestDetail.fieldValue}>{request.producerName}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Procesadas reales de liquidación de pesca</p>
                <p className={saleRequestDetail.fieldValueSemibold}>
                  {priceUnitRO === 'PER_KG' ? (procesadasRealesLbRO * LB_TO_KG).toFixed(2) : procesadasRealesLbRO.toFixed(2)} {unitLabelRO}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Precio de comisión unitario</p>
                <p className={saleRequestDetail.fieldValueText}>
                  $ {commissionUnitRateRO.toFixed(3)} / {unitLabelRO}
                </p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Total comisión (procesadas × comisión)</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {totalCommissionRO.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor total (liquidación)</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {totalValorRO.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor final cancelado del anticipo</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {valorPagadoAnticipoRO.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Subtotal (liquidación + comisión)</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {subtotalConComisionRO.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Valor pagado (subtotal − anticipo cancelado)</p>
                <p className={saleRequestDetail.amountHighlight}>$ {balanceAmountRO.toFixed(2)}</p>
              </div>
              <div className="md:col-span-2">
                <p className={collapsible.fieldLabel}>Estado</p>
                <p className={`${saleRequestDetail.fieldValue} ${saleRequestDetail.statusSuccess}`}>Saldo enviado y confirmado</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className={collapsible.subsectionTitle}>
              Comprobante del pago del saldo
            </h4>
            <div className={collapsible.proofImage}>
              <img
                src={DUMMY_BALANCE_PROOF_IMAGE}
                alt="Comprobante de saldo (ejemplo)"
                className={collapsible.proofImgSm}
              />
            </div>
          </div>
        </div>
      </div>
  );
  if (contentOnly) return content;
  return (
    <CollapsibleSection title="Saldo restante pagado" expanded={expanded} onToggle={onToggle}>
      {content}
    </CollapsibleSection>
  );
};
