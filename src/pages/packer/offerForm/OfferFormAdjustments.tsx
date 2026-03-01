import React from 'react';
import type { OfferFormData, OfferFormType, PriceTier, Adjustment } from './types';
import { VENTA_LOCAL_ROWS } from './constants';
import { formatTalla } from './utils';
import { blockNegativeAndExponentKeys } from './utils';

type VentaLocalKey = keyof OfferFormData['ventaLocalPrices'];

interface OfferFormAdjustmentsProps {
  formType: OfferFormType;
  data: OfferFormData;
  isLocked: boolean;
  onChange: (data: OfferFormData) => void;
  updateAdjustment: (index: number, field: keyof Adjustment, value: string | number) => void;
  updateColaDirectaTier: (index: number, field: keyof PriceTier, value: number | boolean) => void;
  updateVentaLocalPrice: (key: VentaLocalKey, value: number) => void;
  numDisplay: (key: string, n: number | undefined) => string;
  setNumInput: (
    key: string,
    raw: string,
    apply: (n: number | undefined) => void,
    opts?: { max?: number; min?: number; emptyValue?: number }
  ) => void;
  setIncompleteNumBlur: (key: string) => void;
}

export const OfferFormAdjustments: React.FC<OfferFormAdjustmentsProps> = ({
  formType,
  data,
  isLocked,
  onChange,
  updateAdjustment,
  updateColaDirectaTier,
  updateVentaLocalPrice,
  numDisplay,
  setNumInput,
  setIncompleteNumBlur,
}) => (
  <section className="mb-4 p-3 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm">
    <h3 className="text-lg font-semibold text-white mb-0.5 pb-2 border-b border-white/30">
      Descuentos por Clase
    </h3>
    <div className="bg-white/70 border border-sky-300/60 rounded-lg p-3">
      {formType === 'ENTERO' ? (
        <>
          <p className="text-sm text-slate-600 mb-2">
            Elija cómo se pagará lo que no califique como entero: por descuento por clase (B, C) o por
            tabla de precios de cola directa (lo no entero se paga como cola directa según estas
            tallas).
          </p>
          <div className="flex gap-2 mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="enteroAdjustmentsMode"
                checked={data.enteroAdjustmentsMode === 'CLASS'}
                onChange={() => onChange({ ...data, enteroAdjustmentsMode: 'CLASS' })}
                disabled={isLocked}
                className="rounded border-sky-300 text-sky-600 focus:ring-sky-400"
              />
              <span className="text-slate-800">Ajuste por clase (B, C)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="enteroAdjustmentsMode"
                checked={data.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE'}
                onChange={() => onChange({ ...data, enteroAdjustmentsMode: 'COLA_DIRECTA_TABLE' })}
                disabled={isLocked}
                className="rounded border-sky-300 text-sky-600 focus:ring-sky-400"
              />
              <span className="text-slate-800">Tablas de Cola Directa y Venta Local</span>
            </label>
          </div>
          {data.enteroAdjustmentsMode === 'CLASS' ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">
                Moneda fija: USD. Defina el descuento por clase. Opcional.
              </p>
              {data.adjustments.map((adj, idx) => (
                <div
                  key={adj.appliesToClass}
                  className="flex flex-wrap items-center gap-2 p-2 bg-white/80 border border-sky-300/60 rounded-lg"
                >
                  <div className="font-semibold text-slate-800 w-20">Clase {adj.appliesToClass}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Tipo de descuento:</span>
                    <select
                      value={adj.unit}
                      onChange={(e) => {
                        const newUnit = e.target.value as 'USD' | 'PERCENT';
                        const newAmount =
                          newUnit === 'PERCENT' && (adj.amount ?? 0) > 100 ? 100 : adj.amount;
                        const newAdj = [...data.adjustments];
                        newAdj[idx] = { ...newAdj[idx], unit: newUnit, amount: newAmount ?? 0 };
                        onChange({ ...data, adjustments: newAdj });
                      }}
                      disabled={isLocked}
                      className="border border-sky-300 rounded-md px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                    >
                      <option value="USD">
                        Dólar por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}
                      </option>
                      <option value="PERCENT">
                        Porcentaje por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}
                      </option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Monto:</span>
                    <input
                      type="number"
                      min="0"
                      max={adj.unit === 'PERCENT' ? 100 : undefined}
                      step="0.01"
                      value={numDisplay(`adj-enter-${idx}`, adj.amount)}
                      onKeyDown={blockNegativeAndExponentKeys}
                      onChange={(e) =>
                        setNumInput(`adj-enter-${idx}`, e.target.value, (n) =>
                          updateAdjustment(idx, 'amount', n ?? 0),
                          adj.unit === 'PERCENT' ? { max: 100 } : undefined
                        )
                      }
                      onBlur={() => setIncompleteNumBlur(`adj-enter-${idx}`)}
                      readOnly={isLocked}
                      className="w-28 border border-sky-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                    />
                    <span className="text-sm font-medium text-slate-700 w-16">
                      {adj.unit === 'USD' ? 'USD' : '%'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 w-full items-start">
              <h4 className="text-base font-semibold text-slate-800">Cola Directa</h4>
              <h4 className="text-base font-semibold text-slate-800">Venta Local</h4>
              <p className="text-xs text-slate-500 min-w-0">
                Lo que no califique como entero se pagará como cola directa según los precios por
                talla (USD/lb). Indique el precio para cada talla que aplique.
              </p>
              <p className="text-xs text-slate-500 min-w-0">
                Indique el precio (USD) para cada categoría.
              </p>
              <div className="w-full overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden inline-block min-w-0">
                <table className="w-full divide-y divide-sky-300/50 table-fixed">
                  <thead className="bg-sky-500/25">
                    <tr>
                      <th className="px-2 py-1.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                        Talla
                      </th>
                      <th className="px-2 py-1.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                        Precio (USD/lb)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-sky-200/50">
                    {data.colaDirectaTiers.map((tier, idx) => (
                      <tr key={idx} className="hover:bg-white/80">
                        <td className="px-2 py-1">
                          <span className="py-0.5 text-slate-800">
                            {formatTalla(tier.sizeMin, tier.sizeMax)}
                          </span>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={numDisplay(`colaTier-${idx}`, tier.price)}
                            onKeyDown={blockNegativeAndExponentKeys}
                            onChange={(e) =>
                              setNumInput(`colaTier-${idx}`, e.target.value, (n) =>
                                updateColaDirectaTier(idx, 'price', n ?? 0)
                              )
                            }
                            onBlur={() => setIncompleteNumBlur(`colaTier-${idx}`)}
                            readOnly={isLocked}
                            className="w-24 border border-sky-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-full overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden inline-block min-w-0">
                <table className="w-full divide-y divide-sky-300/50 table-fixed">
                  <thead className="bg-sky-500/25">
                    <tr>
                      <th className="px-2 py-1.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                        Categoría
                      </th>
                      <th className="px-2 py-1.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                        Precio (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-sky-200/50">
                    {VENTA_LOCAL_ROWS.map(({ key, label }) => (
                      <tr key={key} className="hover:bg-white/80">
                        <td className="px-2 py-1">
                          <span className="py-0.5 text-slate-800 font-medium">{label}</span>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={numDisplay(`ventaLocal-${key}`, data.ventaLocalPrices[key])}
                            onKeyDown={blockNegativeAndExponentKeys}
                            onChange={(e) =>
                              setNumInput(`ventaLocal-${key}`, e.target.value, (n) =>
                                updateVentaLocalPrice(key, n ?? 0)
                              )
                            }
                            onBlur={() => setIncompleteNumBlur(`ventaLocal-${key}`)}
                            readOnly={isLocked}
                            className="w-24 border border-sky-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-slate-600 mb-2">
            Moneda fija: USD. Defina el descuento por clase (B, C). Los campos de esta sección no son
            obligatorios.
          </p>
          <div className="space-y-2">
            {data.adjustments.map((adj, idx) => (
              <div
                key={adj.appliesToClass}
                className="flex flex-wrap items-center gap-2 p-2 bg-white/80 border border-sky-300/60 rounded-lg"
              >
                <div className="font-semibold text-slate-800 w-20">Clase {adj.appliesToClass}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Tipo de descuento:</span>
                  <select
                    value={adj.unit}
                    onChange={(e) => {
                      const newUnit = e.target.value as 'USD' | 'PERCENT';
                      const newAmount =
                        newUnit === 'PERCENT' && (adj.amount ?? 0) > 100 ? 100 : adj.amount;
                      const newAdj = [...data.adjustments];
                      newAdj[idx] = { ...newAdj[idx], unit: newUnit, amount: newAmount ?? 0 };
                      onChange({ ...data, adjustments: newAdj });
                    }}
                    disabled={isLocked}
                    className="border border-sky-300 rounded-md px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  >
                    <option value="USD">
                      Dólar por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}
                    </option>
                    <option value="PERCENT">
                      Porcentaje por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}
                    </option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Monto:</span>
                  <input
                    type="number"
                    min="0"
                    max={adj.unit === 'PERCENT' ? 100 : undefined}
                    step="0.01"
                    value={numDisplay(`adj-cola-${idx}`, adj.amount)}
                    onKeyDown={blockNegativeAndExponentKeys}
                    onChange={(e) =>
                      setNumInput(`adj-cola-${idx}`, e.target.value, (n) =>
                        updateAdjustment(idx, 'amount', n ?? 0),
                        adj.unit === 'PERCENT' ? { max: 100 } : undefined
                      )
                    }
                    onBlur={() => setIncompleteNumBlur(`adj-cola-${idx}`)}
                    readOnly={isLocked}
                    className="w-28 border border-sky-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                  />
                  <span className="text-sm font-medium text-slate-700 w-16">
                    {adj.unit === 'USD' ? 'USD' : '%'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </section>
);
