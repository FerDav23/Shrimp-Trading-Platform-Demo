import React, { RefObject } from 'react';
import type { SaleRequest, ProducerBankAccount } from '../../../types';
import type { Offer } from '../../../types';
import { normalizeSettlement } from './utils';
import { CollapsibleSection } from './CollapsibleSection';
import { BALANCE_DEADLINE_HOURS } from './constants';

type SettlementInput = Parameters<typeof normalizeSettlement>[0];

interface BalanceTransferSectionProps {
  request: SaleRequest;
  linkedOffer: Offer | null;
  expanded: boolean;
  onToggle: () => void;
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
  expanded,
  onToggle,
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
  const totalValor = settlementForBalance
    ? [...settlementForBalance.colaDirectaALines, ...settlementForBalance.colaDirectaBLines, ...settlementForBalance.ventaLocalLines].reduce(
        (sum, l) => sum + l.pounds * l.unitPrice,
        0
      )
    : 0;
  const balanceTerm = linkedOffer?.paymentTerms.find((p) => p.termType === 'BALANCE');
  const balancePercent = balanceTerm?.percent ?? 70;
  const balanceAmount = (balancePercent / 100) * totalValor;
  const remainingBalanceMs = balancePaymentEndsAt ? Math.max(0, balancePaymentEndsAt - Date.now()) : 0;
  const totalBalanceSeconds = Math.floor(remainingBalanceMs / 1000);
  const balanceHours = Math.floor(totalBalanceSeconds / 3600);
  const balanceMinutes = Math.floor((totalBalanceSeconds % 3600) / 60);
  const balanceSeconds = totalBalanceSeconds % 60;
  const formatTwoBalance = (n: number) => n.toString().padStart(2, '0');
  const isBalanceExpired = balancePaymentEndsAt != null && remainingBalanceMs === 0;

  const producerBankAccounts = request.producerBankAccounts ?? [];
  const safeBankIndex = selectedBankIndex >= producerBankAccounts.length ? 0 : selectedBankIndex;
  const account = producerBankAccounts[safeBankIndex] as ProducerBankAccount | undefined;

  return (
    <CollapsibleSection
      title="Pago del saldo restante al productor"
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="px-6 pb-6">
        <div className="bg-white border border-sky-200 rounded-xl p-6 space-y-8 shadow-sm">
          <div
            className={`rounded-xl border-2 p-4 ${isBalanceExpired ? 'border-red-200 bg-red-50' : 'border-sky-200 bg-sky-50/50'}`}
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Plazo para pagar el saldo restante
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Tiene {BALANCE_DEADLINE_HOURS} horas para realizar la transferencia y subir la prueba.
            </p>
            {isBalanceExpired ? (
              <p className="text-lg font-bold text-red-700">Tiempo agotado</p>
            ) : (
              <>
                <p className="text-2xl font-bold text-red-600 tabular-nums" aria-live="polite">
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
            <h4 className="text-base font-semibold text-sky-800 tracking-tight border-b border-sky-200 pb-2">
              Información del productor
            </h4>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Productor</p>
              <p className="text-base text-gray-900 font-medium leading-snug">{request.producerName}</p>
            </div>
            {producerBankAccounts.length > 0 ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Banco para transferencia
                  </label>
                  <select
                    value={safeBankIndex}
                    onChange={(e) => onSelectedBankIndexChange(Number(e.target.value))}
                    className="w-full md:max-w-sm px-4 py-2.5 border border-sky-200 rounded-lg text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-shadow"
                  >
                    {producerBankAccounts.map((acc, idx) => (
                      <option key={idx} value={idx}>
                        {acc.bankName}
                      </option>
                    ))}
                  </select>
                </div>
                {account && (
                  <div className="mt-4 p-5 border border-sky-100 rounded-xl bg-sky-50/50 space-y-4">
                    <h5 className="text-sm font-semibold text-sky-800 tracking-tight">
                      Datos de la cuenta seleccionada
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Banco</p>
                        <p className="text-gray-900 font-medium">{account.bankName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                          Tipo de cuenta
                        </p>
                        <p className="text-gray-900">{account.accountType}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                          Número de cuenta
                        </p>
                        <p className="text-gray-900 font-semibold tabular-nums">{account.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Titular</p>
                        <p className="text-gray-900 font-medium">{account.accountHolderName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                          Cédula / Identificación
                        </p>
                        <p className="text-gray-900 tabular-nums">{account.identification}</p>
                      </div>
                      {account.email && (
                        <div className="md:col-span-2">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                            Correo
                          </p>
                          <p className="text-gray-900">{account.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No hay datos bancarios registrados para este productor.
              </p>
            )}
          </div>

          <div className="border border-sky-200 rounded-xl p-5 bg-sky-50/30 print:bg-white">
            <h4 className="text-base font-semibold text-sky-800 tracking-tight border-b border-sky-200 pb-2 mb-4">
              Datos para la transferencia del saldo restante
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                  Beneficiario (productor)
                </p>
                <p className="text-gray-900 font-medium">{request.producerName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">ID Solicitud</p>
                <p className="text-gray-900 font-medium tabular-nums">#{request.id.split('-')[1]}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Concepto</p>
                <p className="text-gray-900">Saldo restante por compra de pesca</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                  Valor total (liquidación)
                </p>
                <p className="text-gray-900 font-medium tabular-nums">$ {totalValor.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                  Porcentaje de saldo (oferta)
                </p>
                <p className="text-gray-900 tabular-nums">{balancePercent}%</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                  Monto del saldo restante
                </p>
                <p className="text-lg font-bold text-sky-700 tabular-nums">$ {balanceAmount.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              Realice la transferencia del saldo según los datos acordados con el productor y adjunte la prueba
              de pago abajo.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-semibold text-sky-800 tracking-tight border-b border-sky-200 pb-2">
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium text-sm transition-colors shadow-sm"
                >
                  <svg
                    className="w-5 h-5 shrink-0"
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
                    <span className="font-medium text-gray-700 text-sm">{balanceProofFile.name}</span>
                    <button
                      type="button"
                      onClick={() => onBalanceProofFileChange(null)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium underline underline-offset-2"
                    >
                      Quitar
                    </button>
                  </>
                )}
              </div>
              {balanceProofPreviewUrl && (
                <div className="border border-sky-200 rounded-lg overflow-hidden bg-gray-100 max-w-xs">
                  <img
                    src={balanceProofPreviewUrl}
                    alt="Vista previa del comprobante de saldo"
                    className="w-full h-auto max-h-64 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
