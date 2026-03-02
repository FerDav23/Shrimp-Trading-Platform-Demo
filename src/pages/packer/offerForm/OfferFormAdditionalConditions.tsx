import React from 'react';
import type { OfferFormData } from './types';
import { ADDITIONAL_CONDITION_MAX_LENGTH } from './constants';
import { offerSection, button, form } from '../../../styles';

interface OfferFormAdditionalConditionsProps {
  data: OfferFormData;
  isLocked: boolean;
  addAdditionalCondition: () => void;
  updateAdditionalCondition: (index: number, value: string) => void;
  removeAdditionalCondition: (index: number) => void;
}

export const OfferFormAdditionalConditions: React.FC<OfferFormAdditionalConditionsProps> = ({
  data,
  isLocked,
  addAdditionalCondition,
  updateAdditionalCondition,
  removeAdditionalCondition,
}) => (
  <section className={offerSection.container}>
    <h3 className={offerSection.titleMb2}>
      Condiciones adicionales
    </h3>
    <div className={offerSection.inner}>
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
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateAdditionalCondition(idx, e.target.value)}
                      placeholder="Escriba la condición (máx. 100 caracteres)"
                      maxLength={ADDITIONAL_CONDITION_MAX_LENGTH}
                      readOnly={isLocked}
                      className={'w-full ' + form.inputSmall}
                    />
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
