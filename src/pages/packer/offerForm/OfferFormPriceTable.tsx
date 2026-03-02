import React from 'react';
import type { OfferFormData, PriceTier } from './types';
import { formatTalla } from './utils';
import { blockNegativeAndExponentKeys } from './utils';
import { offerSection } from '../../../styles';

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
    className={offerSection.containerStart}
  >
    <h3 className={offerSection.titleMb2}>
      Tabla de Precios
    </h3>
    <div className={offerSection.inner}>
      <p className={offerSection.textSm + ' mb-2'}>
        Las tallas son fijas por tipo de producto. Indique el precio (USD) para cada talla que desee
        ofrecer; debe haber al menos una con precio. Las tallas sin precio no se mostrarán al
        productor en la oferta.
      </p>
      <div className={offerSection.tableWrapperFull}>
        <table className={offerSection.table}>
          <thead className={offerSection.tableHead}>
            <tr>
              <th className={offerSection.tableTh}>
                Talla
              </th>
              <th className={offerSection.tableTh}>
                Precio (USD/{data.priceUnit === 'PER_KG' ? 'kg' : 'lb'})
              </th>
            </tr>
          </thead>
          <tbody className={offerSection.tableBody}>
            {data.priceTiers.map((tier, idx) => (
              <tr key={idx} className={offerSection.tableRow}>
                <td className={offerSection.tableCell}>
                  <span className={'py-1 ' + offerSection.textBold}>
                    {formatTalla(tier.sizeMin, tier.sizeMax)}
                  </span>
                </td>
                <td className={offerSection.tableCell}>
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
                    className={offerSection.input}
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
