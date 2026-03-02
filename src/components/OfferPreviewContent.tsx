import React from 'react';
import { Money } from './Money';
import { Offer, PriceTier, Adjustment } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { offerPreview, offerSection } from '../styles';

interface OfferPreviewContentProps {
  offer: Offer;
}

const VENTA_LOCAL_ROWS: { key: 'quebrado' | 'rojo' | 'juvenil'; label: string }[] = [
  { key: 'quebrado', label: 'Quebrado' },
  { key: 'rojo', label: 'Rojo' },
  { key: 'juvenil', label: 'Juvenil' },
];

/** Precio por talla tras aplicar el ajuste (USD o %) por clase */
function adjustedPriceForTier(basePrice: number, adj: Adjustment): number {
  if (adj.unit === 'USD') return Math.max(0, basePrice - adj.amount);
  return Math.max(0, basePrice * (1 - adj.amount / 100));
}

function hasVentaLocalPrices(vl?: { quebrado: number; rojo: number; juvenil: number }): boolean {
  if (!vl) return false;
  return vl.quebrado > 0 || vl.rojo > 0 || vl.juvenil > 0;
}

/**
 * Vista de la oferta tal como la ve el productor (información general, precios, calidad, ajustes, términos de pago).
 * Se usa en ProducerOfferDetail y en el modal de vista previa al publicar (PackerOffers).
 */
export const OfferPreviewContent: React.FC<OfferPreviewContentProps> = ({
  offer,
}) => {
  const hasAdjustments =
    (offer.guaranteeClassAPct != null && offer.guaranteeClassAPct > 0) ||
    offer.adjustments.some((a) => a.amount !== 0);

  return (
    <div className="space-y-4">
      <section className={offerPreview.section}>
        <h3 className={offerPreview.title}>Información General</h3>
        <div className={offerPreview.inner}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className={offerPreview.infoLabel}>Empacadora:</span>
              <span className={offerPreview.infoValue}>{offer.packingCompany.name}</span>
            </div>
            <div>
              <span className={offerPreview.infoLabel}>Producto:</span>
              <span className={offerPreview.infoValue}>{offer.productForm}</span>
            </div>
            <div>
              <span className={offerPreview.infoLabel}>Moneda:</span>
              <span className={offerPreview.infoValue}>{offer.currency}</span>
            </div>
            <div>
              <span className={offerPreview.infoLabel}>Unidad:</span>
              <span className={offerPreview.infoValue}>
                {offer.priceUnit.replace('PER_', '/')}
              </span>
            </div>
            <div>
              <span className={offerPreview.infoLabel}>Vigencia:</span>
              <span className={offerPreview.infoValue}>
                {format(new Date(offer.validFrom), 'dd MMM yyyy', { locale: es })} -{' '}
                {format(new Date(offer.validTo), 'dd MMM yyyy', { locale: es })}
              </span>
            </div>
            <div>
              <span className={offerPreview.infoLabel}>Planta:</span>
              <span className={offerPreview.infoValue}>
                {offer.plantLocation.city} - {offer.plantLocation.address}
              </span>
            </div>
            <div>
              <span className={offerPreview.infoLabel}>Tolerancia Logística:</span>
              <span className={offerPreview.infoValue}>{offer.logisticsTolerancePct}%</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 items-stretch">
        <section className={offerPreview.sectionFlex}>
          <h3 className={offerPreview.title}>Tabla de Precios - {offer.productForm}</h3>
          <div className={offerPreview.innerFlex}>
            <div className={offerPreview.tableWrapperOverflow}>
              <table className={offerSection.table}>
                <thead className={offerSection.tableHead}>
                  <tr>
                    <th className={offerSection.tableTh}>
                      Talla
                    </th>
                    <th className={offerSection.tableTh}>
                      Precio ({offer.priceUnit.replace('PER_', '/')})
                    </th>
                  </tr>
                </thead>
                <tbody className={offerSection.tableBody}>
                  {offer.priceTiers
                    .filter((tier) => tier.isActive && tier.price > 0)
                    .map((tier, idx) => (
                      <tr key={idx} className={offerSection.tableRow}>
                        <td className={offerSection.tableCell + ' text-slate-800 font-medium'}>
                          {tier.sizeMin}/{tier.sizeMax}
                        </td>
                        <td className={offerSection.tableCell + ' text-slate-800'}>
                          <Money amount={tier.price} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={offerPreview.sectionFlex}>
          <h3 className={offerPreview.title}>Requisitos de Calidad</h3>
          <div className={offerPreview.innerFlex}>
            <ul className="space-y-2 flex-1">
              {offer.qualityRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-sky-500 mr-2">•</span>
                  <span className={offerPreview.qualityText}>{req.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {offer.productForm === 'ENTERO' &&
       offer.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE' &&
       ((offer.colaDirectaPriceTiers && offer.colaDirectaPriceTiers.some((t) => t.price > 0)) ||
        hasVentaLocalPrices(offer.ventaLocalPrices)) && (
        <section className={offerPreview.section}>
          <h3 className={offerPreview.title}>
            Lo no entero: Cola Directa y Venta Local
          </h3>
          <div className={offerPreview.inner}>
            <p className={offerSection.textSm + ' mb-3'}>
              El producto que no califique como entero se pagará según las tablas de Cola Directa (USD/lb por talla) y/o Venta Local (USD por categoría).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offer.colaDirectaPriceTiers && offer.colaDirectaPriceTiers.some((t) => t.price > 0) && (
                <div>
                  <h4 className={offerPreview.subsectionTitle}>Cola Directa</h4>
                  <div className={offerSection.tableWrapperFull}>
                    <table className={offerSection.table}>
                      <thead className={offerSection.tableHead}>
                        <tr>
                          <th className={offerSection.tableTh}>Talla</th>
                          <th className={offerSection.tableTh}>Precio (USD/lb)</th>
                        </tr>
                      </thead>
                      <tbody className={offerSection.tableBody}>
                        {offer.colaDirectaPriceTiers
                          .filter((tier) => tier.price > 0)
                          .map((tier, idx) => (
                            <tr key={idx} className={offerSection.tableRow}>
                              <td className={offerSection.tableCell + ' text-slate-800 font-medium'}>
                                {tier.sizeMin}/{tier.sizeMax}
                              </td>
                              <td className={offerSection.tableCell + ' text-slate-800'}>
                                <Money amount={tier.price} />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {offer.ventaLocalPrices && hasVentaLocalPrices(offer.ventaLocalPrices) && (
                <div>
                  <h4 className={offerPreview.subsectionTitle}>Venta Local</h4>
                  <div className={offerSection.tableWrapperFull}>
                    <table className={offerSection.table}>
                      <thead className={offerSection.tableHead}>
                        <tr>
                          <th className={offerSection.tableTh}>Categoría</th>
                          <th className={offerSection.tableTh}>Precio (USD)</th>
                        </tr>
                      </thead>
                      <tbody className={offerSection.tableBody}>
                        {VENTA_LOCAL_ROWS.map(({ key, label }) => {
                          const price = offer.ventaLocalPrices![key];
                          if (price == null || price <= 0) return null;
                          return (
                            <tr key={key} className={offerSection.tableRow}>
                              <td className={offerSection.tableCell + ' text-slate-800 font-medium'}>{label}</td>
                              <td className={offerSection.tableCell + ' text-slate-800'}>
                                <Money amount={price} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {hasAdjustments &&
       !(offer.productForm === 'ENTERO' && offer.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE') && (
        <section className={offerPreview.section}>
          <h3 className={offerPreview.title}>Ajustes por Clase</h3>
          <div className={offerPreview.inner}>
            {offer.guaranteeClassAPct != null && offer.guaranteeClassAPct > 0 && (
              <div className="mb-3">
                <span className={offerSection.textMedium}>
                  Garantía clase A: {offer.guaranteeClassAPct}%
                </span>
              </div>
            )}
            {offer.adjustments
              .filter((a) => a.amount !== 0)
              .map((adj, idx) => {
                const activeTiers: PriceTier[] = (offer.priceTiers || []).filter(
                  (tier) => tier.isActive && tier.price > 0
                );
                if (activeTiers.length === 0) return null;
                return (
                  <div key={idx} className="mb-6 last:mb-0">
                    <h4 className={offerPreview.adjustmentTitle}>
                      Clase {adj.appliesToClass} – Precio por talla
                      <span className={offerPreview.adjustmentNote}>
                        (descuento: {adj.unit === 'USD' ? <Money amount={adj.amount} /> : `${adj.amount}%`}
                        {adj.unit === 'USD' && ` por ${offer.priceUnit === 'PER_KG' ? 'kg' : 'libra'}`} aplicado)
                      </span>
                    </h4>
                    <div className={offerSection.tableWrapperFull + ' max-w-xs'}>
                      <table className={offerSection.table + ' min-w-0 w-full'}>
                        <thead className={offerSection.tableHead}>
                          <tr>
                            <th className={offerSection.tableTh + ' w-1/2'}>
                              Talla
                            </th>
                            <th className={offerSection.tableTh + ' w-1/2'}>
                              Precio ({offer.priceUnit.replace('PER_', '/')})
                            </th>
                          </tr>
                        </thead>
                        <tbody className={offerSection.tableBody}>
                          {activeTiers.map((tier, tierIdx) => (
                            <tr key={tierIdx} className={offerSection.tableRow}>
                              <td className={offerSection.tableCell + ' text-slate-800 font-medium'}>
                                {tier.sizeMin}/{tier.sizeMax}
                              </td>
                              <td className={offerSection.tableCell + ' text-slate-800'}>
                                <Money amount={adjustedPriceForTier(tier.price, adj)} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      <section className={offerPreview.section}>
        <h3 className={offerPreview.title}>Términos de Pago</h3>
        <div className={offerPreview.inner}>
          <div className="space-y-3">
            {offer.paymentTerms.map((term, idx) => (
              <div key={idx} className={offerPreview.paymentTermItem}>
                <div className={offerPreview.paymentTermTitle}>
                  {term.termType === 'ADVANCE'
                    ? 'Anticipo'
                    : term.termType === 'BALANCE'
                      ? 'Saldo restante'
                      : 'Otro'}
                </div>
                {term.termType === 'CUSTOM' ? (
                  <div className={offerPreview.paymentTermText}>{term.text}</div>
                ) : (
                  <>
                    <div className={offerPreview.paymentTermText}>
                      {term.termType === 'ADVANCE' &&
                        term.percent != null &&
                        `${term.percent}% - `}
                      {term.termType === 'BALANCE' &&
                        (() => {
                          const adv = offer.paymentTerms.find(
                            (p) => p.termType === 'ADVANCE'
                          )?.percent;
                          return adv != null ? `${100 - adv}% - ` : '';
                        })()}
                      {(() => {
                        const dias = term.dueInDays ?? (term.dueInHours ? Math.floor(term.dueInHours / 24) : undefined);
                        return dias ? `Vence en ${dias} días` : '';
                      })()}
                    </div>
                    {term.trigger && (
                      <div className={offerPreview.paymentTermTrigger}>
                        Trigger: {term.trigger}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {offer.additionalConditions && offer.additionalConditions.length > 0 && (
        <section className={offerPreview.section}>
          <h3 className={offerPreview.title}>Condiciones adicionales</h3>
          <div className={offerPreview.inner}>
            <ul className={offerPreview.conditionsList}>
              {offer.additionalConditions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};
