import React from 'react';
import type { OfferFormData } from './types';
import { ADDITIONAL_CONDITION_MAX_LENGTH, FORM_ROW_SUBTITLE_LABEL } from './constants';
import { InputWithInfo } from '../../../components/InputWithInfo';
import { FormRow } from '../../../components/FormRow';
import { blockNegativeAndExponentKeys } from './utils';
import { offerSection, button, form } from '../../../styles';

interface OfferFormAdditionalConditionsProps {
  data: OfferFormData;
  isLocked: boolean;
  addAdditionalCondition: () => void;
  updateAdditionalCondition: (index: number, value: string) => void;
  removeAdditionalCondition: (index: number) => void;
  updateData: (updates: Partial<OfferFormData>) => void;
  numDisplay: (key: string, n: number | undefined) => string;
  setNumInput: (
    key: string,
    raw: string,
    apply: (n: number | undefined) => void,
    opts?: { max?: number; min?: number; emptyValue?: number; integerOnly?: boolean }
  ) => void;
  setIncompleteNumBlur: (key: string) => void;
}

export const OfferFormAdditionalConditions: React.FC<OfferFormAdditionalConditionsProps> = ({
  data,
  isLocked,
  addAdditionalCondition,
  updateAdditionalCondition,
  removeAdditionalCondition,
  updateData,
  numDisplay,
  setNumInput,
  setIncompleteNumBlur,
}) => {
  const unit = data.priceUnit === 'PER_KG' ? 'kg' : 'lb';
  const minVal = data.quantityRangeMin;
  const maxVal = data.quantityRangeMax;
  const hasRangeError =
    minVal != null &&
    maxVal != null &&
    minVal > 0 &&
    maxVal > 0 &&
    minVal > maxVal;

  return (
  <section className={offerSection.container}>
    <h3 className={offerSection.titleMb2}>
      Condiciones adicionales
    </h3>
    <div className={offerSection.inner}>
      <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <h4 className={offerSection.textBold + ' mb-1'}>Cantidad de pesca a comprar (opcional)</h4>
        <p className={offerSection.textSm + ' text-slate-600 mb-3'}>
          Indique el rango de cantidad que desea comprar. Puede indicar solo mínimo, solo máximo, o ambos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label={`Cantidad mínima (${unit})`}>
            <InputWithInfo
              infoText="Cantidad mínima de pesca que desea comprar. Deje vacío si no aplica."
              className="block w-full"
            >
              <input
                type="text"
                inputMode="decimal"
                value={numDisplay('quantityRangeMin', minVal === 0 ? undefined : minVal)}
                onKeyDown={blockNegativeAndExponentKeys}
                onChange={(e) =>
                  setNumInput('quantityRangeMin', e.target.value, (n) =>
                    updateData({ quantityRangeMin: n })
                  )
                }
                onBlur={() => setIncompleteNumBlur('quantityRangeMin')}
                placeholder="Mín."
                readOnly={isLocked}
                className={'w-full ' + form.inputSmall}
              />
            </InputWithInfo>
          </FormRow>
          <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label={`Cantidad máxima (${unit})`}>
            <InputWithInfo
              infoText="Cantidad máxima de pesca que desea comprar. Deje vacío si no aplica."
              className="block w-full"
            >
              <input
                type="text"
                inputMode="decimal"
                value={numDisplay('quantityRangeMax', maxVal === 0 ? undefined : maxVal)}
                onKeyDown={blockNegativeAndExponentKeys}
                onChange={(e) =>
                  setNumInput('quantityRangeMax', e.target.value, (n) =>
                    updateData({ quantityRangeMax: n })
                  )
                }
                onBlur={() => setIncompleteNumBlur('quantityRangeMax')}
                placeholder="Máx."
                readOnly={isLocked}
                className={'w-full ' + form.inputSmall}
              />
            </InputWithInfo>
          </FormRow>
        </div>
        {hasRangeError && (
          <p className="text-sm text-amber-600 mt-1" role="alert">
            La cantidad mínima no puede ser mayor que la máxima.
          </p>
        )}
      </div>
      <p className={offerSection.textSm + ' mb-2'}>
        Items de texto (máximo {ADDITIONAL_CONDITION_MAX_LENGTH} caracteres por item). Añada las
        condiciones que apliquen a esta oferta.
      </p>
      <div className={offerSection.tableWrapperFull}>
        <table className={offerSection.table}>
          <thead className={offerSection.tableHead}>
            <tr>
              <th className={offerSection.tableTh + ' w-12'}>
                #
              </th>
              <th className={offerSection.tableTh}>
                Condición
              </th>
              {!isLocked && (
                <th className={offerSection.tableTh + ' text-right w-24'}>
                  Acción
                </th>
              )}
            </tr>
          </thead>
          <tbody className={offerSection.tableBody}>
            {data.additionalConditions.length === 0 ? (
              <tr>
                <td
                  colSpan={isLocked ? 2 : 3}
                  className={offerSection.tableEmpty}
                >
                  No hay condiciones. Use el botón para añadir.
                </td>
              </tr>
            ) : (
              data.additionalConditions.map((item, idx) => (
                <tr key={idx} className={offerSection.tableRow}>
                  <td className={offerSection.tableCell}>
                    <span className={offerSection.textBold}>{idx + 1}</span>
                  </td>
                  <td className={offerSection.tableCell}>
                    <InputWithInfo infoText="En esta sección puede agregar condiciones adicionales a la oferta. Por ejemplo, 'El producto debe ser entregado en la fecha y hora acordada' o 'El producto debe ser entregado en la fecha y hora acordada'." className="block w-full">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateAdditionalCondition(idx, e.target.value)}
                        placeholder="Escriba la condición (máx. 100 caracteres)"
                        maxLength={ADDITIONAL_CONDITION_MAX_LENGTH}
                        readOnly={isLocked}
                        className={'w-full ' + form.inputSmall}
                      />
                    </InputWithInfo>
                    <span className={offerSection.textMuted + ' mt-0.5 block'}>
                      {item.length}/{ADDITIONAL_CONDITION_MAX_LENGTH}
                    </span>
                  </td>
                  {!isLocked && (
                    <td className={offerSection.tableCellRight}>
                      <button
                        type="button"
                        onClick={() => removeAdditionalCondition(idx)}
                        className={button.delete}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!isLocked && (
        <div className={offerSection.footer}>
          <button
            type="button"
            onClick={addAdditionalCondition}
            className={button.addSecondary}
          >
            + Añadir item
          </button>
        </div>
      )}
    </div>
  </section>
  );
};
