import React from 'react';
import type { OfferFormData } from './types';
import { ADDITIONAL_CONDITION_MAX_LENGTH } from './constants';

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
  <section className="mb-8 p-6 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm">
    <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-white/30">
      Condiciones adicionales
    </h3>
    <div className="bg-white/70 border border-sky-300/60 rounded-lg p-4">
      <p className="text-sm text-slate-600 mb-4">
        Items de texto (máximo {ADDITIONAL_CONDITION_MAX_LENGTH} caracteres por item). Añada las
        condiciones que apliquen a esta oferta.
      </p>
      <div className="overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden">
        <table className="min-w-full divide-y divide-sky-300/50">
          <thead className="bg-sky-500/25">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide w-12">
                #
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                Condición
              </th>
              {!isLocked && (
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-800 uppercase tracking-wide w-24">
                  Acción
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sky-200/50">
            {data.additionalConditions.length === 0 ? (
              <tr>
                <td
                  colSpan={isLocked ? 2 : 3}
                  className="px-4 py-6 text-center text-slate-500 text-sm"
                >
                  No hay condiciones. Use el botón para añadir.
                </td>
              </tr>
            ) : (
              data.additionalConditions.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/80">
                  <td className="px-4 py-2">
                    <span className="text-slate-800 font-medium">{idx + 1}</span>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateAdditionalCondition(idx, e.target.value)}
                      placeholder="Escriba la condición (máx. 100 caracteres)"
                      maxLength={ADDITIONAL_CONDITION_MAX_LENGTH}
                      readOnly={isLocked}
                      className="w-full border border-sky-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800 placeholder-slate-400"
                    />
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      {item.length}/{ADDITIONAL_CONDITION_MAX_LENGTH}
                    </span>
                  </td>
                  {!isLocked && (
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeAdditionalCondition(idx)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded px-2 py-1 text-sm font-medium transition-colors"
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
        <div className="mt-4 pt-4 border-t border-sky-400/40">
          <button
            type="button"
            onClick={addAdditionalCondition}
            className="bg-white text-sky-700 border border-sky-300 hover:bg-sky-50 hover:text-sky-800 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          >
            + Añadir item
          </button>
        </div>
      )}
    </div>
  </section>
);
