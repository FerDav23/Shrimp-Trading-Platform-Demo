import React from 'react';
import { FormRow } from '../../../components/FormRow';
import type { OfferFormData, PaymentTerm } from './types';
import { FORM_ROW_SUBTITLE_LABEL, STRING_INPUT_MAX_LENGTH, TRIGGER_MAX_LENGTH } from './constants';
import { blockNegativeAndExponentKeys } from './utils';

interface OfferFormPaymentTermsProps {
  data: OfferFormData;
  isLocked: boolean;
  addPaymentTerm: () => void;
  removePaymentTerm: (index: number) => void;
  updatePaymentTerm: (
    index: number,
    field: keyof PaymentTerm,
    value: string | number | undefined
  ) => void;
  numDisplay: (key: string, n: number | undefined) => string;
  setNumInput: (
    key: string,
    raw: string,
    apply: (n: number | undefined) => void,
    opts?: { max?: number; emptyValue?: number }
  ) => void;
  setIncompleteNumBlur: (key: string) => void;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

export const OfferFormPaymentTerms: React.FC<OfferFormPaymentTermsProps> = ({
  data,
  isLocked,
  addPaymentTerm,
  removePaymentTerm,
  updatePaymentTerm,
  numDisplay,
  setNumInput,
  setIncompleteNumBlur,
  inputProps,
}) => (
  <section className="mb-4 p-3 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm">
    <h3 className="text-lg font-semibold text-white mb-2 pb-2 border-b border-white/30">
      Términos de Pago
    </h3>
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.paymentTerms.map((term, idx) => {
          if (term.termType === 'ADVANCE') {
            return (
              <div key="advance" className="border border-sky-300/60 rounded-lg p-3 bg-white/70">
                <h4 className="font-semibold text-slate-800 mb-2">Anticipo (requerido)</h4>
                <div className="space-y-2">
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Porcentaje (%)" required>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={numDisplay('percent-adv', term.percent)}
                      onKeyDown={blockNegativeAndExponentKeys}
                      onChange={(e) =>
                        setNumInput('percent-adv', e.target.value, (n) =>
                          updatePaymentTerm(idx, 'percent', n ?? 0),
                          { max: 100 }
                        )
                      }
                      onBlur={() => setIncompleteNumBlur('percent-adv')}
                      {...inputProps}
                    />
                  </FormRow>
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Vence en (horas)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={numDisplay('dueInHours-adv', term.dueInHours)}
                      onKeyDown={blockNegativeAndExponentKeys}
                      onChange={(e) =>
                        setNumInput('dueInHours-adv', e.target.value, (n) =>
                          updatePaymentTerm(idx, 'dueInHours', n),
                          { emptyValue: undefined }
                        )
                      }
                      onBlur={() => setIncompleteNumBlur('dueInHours-adv')}
                      placeholder="Ej: 24"
                      {...inputProps}
                    />
                  </FormRow>
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Condición/Trigger">
                    <input
                      type="text"
                      value={term.trigger ?? ''}
                      maxLength={TRIGGER_MAX_LENGTH}
                      onChange={(e) =>
                        updatePaymentTerm(idx, 'trigger', e.target.value.slice(0, TRIGGER_MAX_LENGTH))
                      }
                      placeholder="Ej: Confirmación de compra"
                      {...inputProps}
                    />
                  </FormRow>
                </div>
              </div>
            );
          }
          if (term.termType === 'BALANCE') {
            const advancePercent = data.paymentTerms.find((p) => p.termType === 'ADVANCE')?.percent ?? 0;
            const balancePercent = 100 - advancePercent;
            return (
              <div key="balance" className="border border-sky-300/60 rounded-lg p-3 bg-white/70">
                <h4 className="font-semibold text-slate-800 mb-2">Saldo restante (requerido)</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Porcentaje: {balancePercent}% (lo faltante después del anticipo)
                </p>
                <div className="space-y-2">
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Vence en (horas)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={numDisplay('dueInHours-bal', term.dueInHours)}
                      onKeyDown={blockNegativeAndExponentKeys}
                      onChange={(e) =>
                        setNumInput('dueInHours-bal', e.target.value, (n) =>
                          updatePaymentTerm(idx, 'dueInHours', n),
                          { emptyValue: undefined }
                        )
                      }
                      onBlur={() => setIncompleteNumBlur('dueInHours-bal')}
                      placeholder="Ej: 168 (7 días)"
                      {...inputProps}
                    />
                  </FormRow>
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Condición/Trigger">
                    <input
                      type="text"
                      value={term.trigger ?? ''}
                      maxLength={TRIGGER_MAX_LENGTH}
                      onChange={(e) =>
                        updatePaymentTerm(idx, 'trigger', e.target.value.slice(0, TRIGGER_MAX_LENGTH))
                      }
                      placeholder="Ej: Entrega en planta"
                      {...inputProps}
                    />
                  </FormRow>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      {data.paymentTerms.map((term, idx) => {
        if (term.termType === 'ADVANCE' || term.termType === 'BALANCE') return null;
        return (
          <div key={idx} className="border border-sky-300/60 rounded-lg p-3 bg-white/70">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-slate-800">Término opcional</h4>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => removePaymentTerm(idx)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded px-2 py-1 text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
            <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Descripción (texto libre)">
              <textarea
                value={term.text ?? ''}
                maxLength={STRING_INPUT_MAX_LENGTH}
                onChange={(e) =>
                  updatePaymentTerm(idx, 'text', e.target.value.slice(0, STRING_INPUT_MAX_LENGTH))
                }
                placeholder="Escriba cualquier término o condición adicional..."
                readOnly={isLocked}
                className="w-full border border-sky-300 rounded-md px-3 py-2 min-h-[80px] bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800 placeholder-slate-500"
                rows={3}
              />
            </FormRow>
          </div>
        );
      })}
    </div>
    {!isLocked && (
      <div className="mt-2 pt-2 border-t border-sky-400/40">
        <button
          type="button"
          onClick={addPaymentTerm}
          className="bg-white text-sky-700 border border-sky-300 hover:bg-sky-50 hover:text-sky-800 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
        >
          + Añadir término opcional
        </button>
      </div>
    )}
  </section>
);
