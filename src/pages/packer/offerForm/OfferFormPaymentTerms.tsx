import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { InputWithInfo } from '../../../components/InputWithInfo';
import type { OfferFormData, PaymentTerm } from './types';
import { FORM_ROW_SUBTITLE_LABEL, STRING_INPUT_MAX_LENGTH, TRIGGER_CONDITIONS_BD } from './constants';
import { blockNegativeAndExponentKeys } from './utils';
import { offerSection, button } from '../../../styles';

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
    opts?: { max?: number; min?: number; emptyValue?: number; integerOnly?: boolean }
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
  <section className={offerSection.container}>
    <h3 className={offerSection.titleMb2}>
      Condiciones de Pago
    </h3>
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.paymentTerms.map((term, idx) => {
          if (term.termType === 'ADVANCE') {
            return (
              <div key="advance" className={offerSection.block}>
                <h4 className={offerSection.textBold + ' mb-2'}>Anticipo (requerido)</h4>
                <div className="space-y-2">
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Porcentaje (%)" required>
                    <InputWithInfo infoText="Ingrese el porcentaje de anticipo." className="block w-full">
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
                    </InputWithInfo>
                  </FormRow>
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Vence en (horas)">
                    <InputWithInfo infoText="Ingrese el número de horas en el anticipo va a ser cancelado." className="block w-full">
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
                    </InputWithInfo>
                  </FormRow>
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Condición/Trigger">
                    <InputWithInfo infoText="Seleccione la condición o trigger del anticipo." className="block w-full">
                      <select
                        value={term.trigger ?? ''}
                        onChange={(e) => updatePaymentTerm(idx, 'trigger', e.target.value || undefined)}
                        disabled={inputProps.disabled}
                        className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500"
                      >
                        <option value="">Seleccione una condición</option>
                        {TRIGGER_CONDITIONS_BD.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </InputWithInfo>
                  </FormRow>
                </div>
              </div>
            );
          }
          if (term.termType === 'BALANCE') {
            return (
              <div key="balance" className={offerSection.block}>
                <h4 className={offerSection.textBold + ' mb-2'}>Liquidacion de la venta (requerido)</h4>
                <p className={offerSection.textSm + ' mb-2'}>
                  El valor a liquidar se definira despues de la liquidacion de la pesca
                </p>
                <div className="space-y-2">
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Vence en (días)">
                    <InputWithInfo infoText="Ingrese el número de días en que el saldo restante va a ser cancelado." className="block w-full">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={numDisplay('dueInDays-bal', term.dueInDays)}
                        onKeyDown={blockNegativeAndExponentKeys}
                        onChange={(e) =>
                          setNumInput('dueInDays-bal', e.target.value, (n) =>
                            updatePaymentTerm(idx, 'dueInDays', n),
                            { emptyValue: undefined, integerOnly: true }
                          )
                        }
                        onBlur={() => setIncompleteNumBlur('dueInDays-bal')}
                        placeholder="Ej: 7"
                        {...inputProps}
                      />
                    </InputWithInfo>
                  </FormRow>
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Condición">
                    <p className={offerSection.textSm + ' text-slate-600'}>
                      Al recibir la factura de acuerdo a la liquidacion de la pesca.
                    </p>
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
          <div key={idx} className={offerSection.block}>
            <div className="flex justify-between items-center mb-1">
              <h4 className={offerSection.textBold}>Término opcional</h4>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => removePaymentTerm(idx)}
                  className={button.delete}
                >
                  Remove
                </button>
              )}
            </div>
            <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Descripción (texto libre)">
              <InputWithInfo infoText="Ingrese cualquier término o condición adicional." className="block w-full">
                <textarea
                  value={term.text ?? ''}
                  maxLength={STRING_INPUT_MAX_LENGTH}
                  onChange={(e) =>
                    updatePaymentTerm(idx, 'text', e.target.value.slice(0, STRING_INPUT_MAX_LENGTH))
                  }
                  placeholder="Escriba cualquier término o condición adicional..."
                  readOnly={isLocked}
                  className={offerSection.textarea}
                  rows={3}
                />
              </InputWithInfo>
            </FormRow>
          </div>
        );
      })}
    </div>
    {!isLocked && (
      <div className={offerSection.footer}>
        <button
          type="button"
          onClick={addPaymentTerm}
          className={button.addSecondary}
        >
          + Añadir término opcional
        </button>
      </div>
    )}
  </section>
);
