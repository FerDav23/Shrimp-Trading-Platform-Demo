import React from 'react';
import type { SaleRequest } from '../../../types';
import { collapsible, saleRequestDetail } from '../../../styles';
import { normalizeSettlement } from './utils';
import { CollapsibleSection } from './CollapsibleSection';
import { DUMMY_BALANCE_PROOF_IMAGE } from './constants';
import type { Offer } from '../../../types';

type SettlementInput = Parameters<typeof normalizeSettlement>[0];

interface BalanceReadOnlySectionProps {
  request: SaleRequest;
  linkedOffer: Offer | null;
  expanded: boolean;
  onToggle: () => void;
}

export const BalanceReadOnlySection: React.FC<BalanceReadOnlySectionProps> = ({
  request,
  linkedOffer,
  expanded,
  onToggle,
}) => {
  const settlementForReadOnly = request.catchSettlement
    ? normalizeSettlement(request.catchSettlement as SettlementInput)
    : null;
  const totalValorRO = settlementForReadOnly
    ? [...settlementForReadOnly.colaDirectaALines, ...settlementForReadOnly.colaDirectaBLines, ...settlementForReadOnly.ventaLocalLines].reduce(
        (sum, l) => sum + l.pounds * l.unitPrice,
        0
      )
    : 0;
  const balanceTermRO = linkedOffer?.paymentTerms.find((p) => p.termType === 'BALANCE');
  const balancePercentRO = balanceTermRO?.percent ?? 70;
  const balanceAmountRO = (balancePercentRO / 100) * totalValorRO;
  const firstAccount = request.producerBankAccounts?.[0];

  return (
    <CollapsibleSection title="Saldo restante pagado" expanded={expanded} onToggle={onToggle}>
      <div className={collapsible.content}>
        <div className={collapsible.innerBoxXl}>
          <div className="space-y-4">
            <h4 className={collapsible.subsectionTitle}>
              Información del productor
            </h4>
            <div>
              <p className={collapsible.fieldLabelMb1}>Productor</p>
              <p className="text-base text-gray-900 font-medium leading-snug">{request.producerName}</p>
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
                <p className={collapsible.fieldLabel}>Valor total (liquidación)</p>
                <p className={saleRequestDetail.fieldValueSemibold}>$ {totalValorRO.toFixed(2)}</p>
              </div>
              <div>
                <p className={collapsible.fieldLabel}>Monto del saldo pagado</p>
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
    </CollapsibleSection>
  );
};
