import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { InputWithInfo } from '../../../components/InputWithInfo';
import type { OfferFormData, PaymentTerm } from './types';
import { FORM_ROW_SUBTITLE_LABEL, STRING_INPUT_MAX_LENGTH, TRIGGER_MAX_LENGTH } from './constants';
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
                    <InputWithInfo className="block w-full">
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
                    <InputWithInfo className="block w-full">
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
                    <InputWithInfo className="block w-full">
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
                    </InputWithInfo>
                  </FormRow>
                </div>
              </div>
            );
          }
          if (term.termType === 'BALANCE') {
            const advancePercent = data.paymentTerms.find((p) => p.termType === 'ADVANCE')?.percent ?? 0;
            const balancePercent = 100 - advancePercent;
            return (
              <div key="balance" className={offerSection.block}>
                <h4 className={offerSection.textBold + ' mb-2'}>Saldo restante (requerido)</h4>
                <p className={offerSection.textSm + ' mb-2'}>
                  Porcentaje: {balancePercent}% (lo faltante después del anticipo)
                </p>
                <div className="space-y-2">
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Vence en (horas)">
                    <InputWithInfo className="block w-full">
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
                    </InputWithInfo>
                  </FormRow>
                  <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Condición/Trigger">
                    <InputWithInfo className="block w-full">
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
                    </InputWithInfo>
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
                  Eliminar
                </button>
              )}
            </div>
            <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Descripción (texto libre)">
              <InputWithInfo className="block w-full">
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
