import React from 'react';
import type { OfferFormData, PriceTier } from './types';
import { formatTalla } from './utils';
import { blockNegativeAndExponentKeys } from './utils';

interface OfferFormPriceTableProps {
  data: OfferFormData;
  isLocked: boolean;
  updatePriceTier: (index: number, field: keyof PriceTier, value: number | boolean) => void;
  numDisplay: (key: string, n: number | undefined) => string;
  setNumInput: (
    key: string,
    raw: string,
    apply: (n: number | undefined) => void,
    opts?: { max?: number; min?: number; emptyValue?: number }
  ) => void;
  setIncompleteNumBlur: (key: string) => void;
  sectionRef?: React.RefObject<HTMLElement | null>;
}

export const OfferFormPriceTable: React.FC<OfferFormPriceTableProps> = ({
  data,
  isLocked,
  updatePriceTier,
  numDisplay,
  setNumInput,
  setIncompleteNumBlur,
  sectionRef,
}) => (
  <section
    ref={sectionRef as React.RefObject<HTMLElement> | undefined}
    className="p-6 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm self-start"
  >
    <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-white/30">
      Tabla de Precios
    </h3>
    <div className="bg-white/70 border border-sky-300/60 rounded-lg p-4">
      <p className="text-sm text-slate-600 mb-4">
        Las tallas son fijas por tipo de producto. Indique el precio (USD) para cada talla que desee
        ofrecer; debe haber al menos una con precio. Las tallas sin precio no se mostrarán al
        productor en la oferta.
      </p>
      <div className="overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden">
        <table className="min-w-full divide-y divide-sky-300/50">
          <thead className="bg-sky-500/25">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                Talla
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                Precio (USD/{data.priceUnit === 'PER_KG' ? 'kg' : 'lb'})
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sky-200/50">
            {data.priceTiers.map((tier, idx) => (
              <tr key={idx} className="hover:bg-white/80">
                <td className="px-4 py-2">
                  <span className="py-1 text-slate-800 font-medium">
                    {formatTalla(tier.sizeMin, tier.sizeMax)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={numDisplay(`priceTier-${idx}`, tier.price)}
                    onKeyDown={blockNegativeAndExponentKeys}
                    onChange={(e) =>
                      setNumInput(`priceTier-${idx}`, e.target.value, (n) =>
                        updatePriceTier(idx, 'price', n ?? 0)
                      )
                    }
                    onBlur={() => setIncompleteNumBlur(`priceTier-${idx}`)}
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
  </section>
);
