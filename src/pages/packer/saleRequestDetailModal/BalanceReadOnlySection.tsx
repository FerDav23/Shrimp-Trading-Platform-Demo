import React from 'react';
import type { SaleRequest } from '../../../types';
import { collapsible } from '../../../styles';
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
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Productor</p>
              <p className="text-base text-gray-900 font-medium leading-snug">{request.producerName}</p>
            </div>
            {firstAccount && (
              <div className={collapsible.bankCard}>
                <h5 className="text-sm font-semibold text-sky-800 tracking-tight">
                  Datos de la cuenta utilizada
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Banco</p>
                    <p className="text-gray-900 font-medium">{firstAccount.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                      Número de cuenta
                    </p>
                    <p className="text-gray-900 font-semibold tabular-nums">{firstAccount.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Titular</p>
                    <p className="text-gray-900 font-medium">{firstAccount.accountHolderName}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={collapsible.transferBox}>
            <h4 className={collapsible.subsectionTitleMb}>
              Resumen del pago del saldo
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                  Beneficiario
                </p>
                <p className="text-gray-900 font-medium">{request.producerName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                  Valor total (liquidación)
                </p>
                <p className="text-gray-900 font-medium tabular-nums">$ {totalValorRO.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                  Monto del saldo pagado
                </p>
                <p className="text-lg font-bold text-sky-700 tabular-nums">$ {balanceAmountRO.toFixed(2)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Estado</p>
                <p className="text-gray-900 font-medium text-green-700">Saldo enviado y confirmado</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-sky-800 tracking-tight border-b border-sky-200 pb-2">
              Comprobante del pago del saldo
            </h4>
            <div className={collapsible.proofImage}>
              <img
                src={DUMMY_BALANCE_PROOF_IMAGE}
                alt="Comprobante de saldo (ejemplo)"
                className="w-full h-auto max-h-48 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
