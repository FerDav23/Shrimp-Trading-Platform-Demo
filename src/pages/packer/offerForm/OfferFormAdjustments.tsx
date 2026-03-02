import React from 'react';
import type { OfferFormData, OfferFormType, PriceTier, Adjustment } from './types';
import { VENTA_LOCAL_ROWS } from './constants';
import { formatTalla } from './utils';
import { blockNegativeAndExponentKeys } from './utils';
import { InputWithInfo } from '../../../components/InputWithInfo';
import { offerSection } from '../../../styles';

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
  <section className={offerSection.container}>
    <h3 className={offerSection.title}>
      Descuentos por Clase
    </h3>
    <div className={offerSection.inner}>
      {formType === 'ENTERO' ? (
        <>
          <p className={`${offerSection.textSm} mb-2`}>
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
                className={offerSection.radio}
              />
              <span className={offerSection.textBold}>Ajuste por clase (B, C)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="enteroAdjustmentsMode"
                checked={data.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE'}
                onChange={() => onChange({ ...data, enteroAdjustmentsMode: 'COLA_DIRECTA_TABLE' })}
                disabled={isLocked}
                className={offerSection.radio}
              />
              <span className={offerSection.textBold}>Tablas de Cola Directa y Venta Local</span>
            </label>
          </div>
          {data.enteroAdjustmentsMode === 'CLASS' ? (
            <div className="space-y-2">
              <p className={offerSection.textMuted}>
                Moneda fija: USD. Defina el descuento por clase. Opcional.
              </p>
              {data.adjustments.map((adj, idx) => (
                <div
                  key={adj.appliesToClass}
                  className={offerSection.row}
                >
                  <div className={`${offerSection.textBold} w-20`}>Clase {adj.appliesToClass}</div>
                  <div className="flex items-center gap-2">
                    <span className={offerSection.textLabel}>Tipo de descuento:</span>
                    <InputWithInfo className="inline-block">
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
                        className={offerSection.select}
                      >
                        <option value="USD">
                          Dólar por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}
                        </option>
                        <option value="PERCENT">
                          Porcentaje por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}
                        </option>
                      </select>
                    </InputWithInfo>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={offerSection.textLabel}>Monto:</span>
                    <InputWithInfo className="inline-block">
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
                        className={offerSection.inputWide}
                      />
                    </InputWithInfo>
                    <span className={offerSection.textUnit}>
                      {adj.unit === 'USD' ? 'USD' : '%'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 w-full items-start">
              <h4 className={`${offerSection.textBold} text-base`}>Cola Directa</h4>
              <h4 className={`${offerSection.textBold} text-base`}>Venta Local</h4>
              <p className={`${offerSection.textMuted} min-w-0`}>
                Lo que no califique como entero se pagará como cola directa según los precios por
                talla (USD/lb). Indique el precio para cada talla que aplique.
              </p>
              <p className={`${offerSection.textMuted} min-w-0`}>
                Indique el precio (USD) para cada categoría.
              </p>
              <div className={offerSection.tableWrapper}>
                <table className={offerSection.table}>
                  <thead className={offerSection.tableHead}>
                    <tr>
                      <th className={offerSection.tableTh}>
                        Talla
                      </th>
                      <th className={offerSection.tableTh}>
                        Precio (USD/lb)
                      </th>
                    </tr>
                  </thead>
                  <tbody className={offerSection.tableBody}>
                    {data.colaDirectaTiers.map((tier, idx) => (
                      <tr key={idx} className={offerSection.tableRow}>
                        <td className={offerSection.tableCell}>
                          <span className={offerSection.tableCellText}>
                            {formatTalla(tier.sizeMin, tier.sizeMax)}
                          </span>
                        </td>
                        <td className={offerSection.tableCell}>
                          <InputWithInfo className="inline-block">
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
                            className={offerSection.input}
                          />
                          </InputWithInfo>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={offerSection.tableWrapper}>
                <table className={offerSection.table}>
                  <thead className={offerSection.tableHead}>
                    <tr>
                      <th className={offerSection.tableTh}>
                        Categoría
                      </th>
                      <th className={offerSection.tableTh}>
                        Precio (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody className={offerSection.tableBody}>
                    {VENTA_LOCAL_ROWS.map(({ key, label }) => (
                      <tr key={key} className={offerSection.tableRow}>
                        <td className={offerSection.tableCell}>
                          <span className={`${offerSection.tableCellText} font-medium`}>{label}</span>
                        </td>
                        <td className={offerSection.tableCell}>
                          <InputWithInfo className="inline-block">
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
                            className={offerSection.input}
                          />
                          </InputWithInfo>
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
          <p className={`${offerSection.textSm} mb-2`}>
            Moneda fija: USD. Defina el descuento por clase (B, C). Los campos de esta sección no son
            obligatorios.
          </p>
          <div className="space-y-2">
            {data.adjustments.map((adj, idx) => (
              <div
                key={adj.appliesToClass}
                className={offerSection.row}
              >
                <div className={`${offerSection.textBold} w-20`}>Clase {adj.appliesToClass}</div>
                <div className="flex items-center gap-2">
                  <span className={offerSection.textLabel}>Tipo de descuento:</span>
                  <InputWithInfo className="inline-block">
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
                      className={offerSection.select}
                    >
                      <option value="USD">
                        Dólar por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}
                      </option>
                      <option value="PERCENT">
                        Porcentaje por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}
                      </option>
                    </select>
                  </InputWithInfo>
                </div>
                <div className="flex items-center gap-2">
                  <span className={offerSection.textLabel}>Monto:</span>
                  <InputWithInfo className="inline-block">
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
                      className={offerSection.inputWide}
                    />
                  </InputWithInfo>
                  <span className={offerSection.textUnit}>
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
