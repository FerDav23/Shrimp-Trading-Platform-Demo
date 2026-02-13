import React from 'react';
import { Card } from './Card';
import { Money } from './Money';
import { Offer } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OfferPreviewContentProps {
  offer: Offer;
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
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Información General
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Empacadora:</span>
            <span className="ml-2 font-medium">{offer.packingCompany.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Producto:</span>
            <span className="ml-2 font-medium">{offer.productForm}</span>
          </div>
          <div>
            <span className="text-gray-600">Moneda:</span>
            <span className="ml-2 font-medium">{offer.currency}</span>
          </div>
          <div>
            <span className="text-gray-600">Unidad:</span>
            <span className="ml-2 font-medium">
              {offer.priceUnit.replace('PER_', '/')}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Vigencia:</span>
            <span className="ml-2 font-medium">
              {format(new Date(offer.validFrom), 'dd MMM yyyy', { locale: es })} -{' '}
              {format(new Date(offer.validTo), 'dd MMM yyyy', { locale: es })}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Planta:</span>
            <span className="ml-2 font-medium">
              {offer.plantLocation.city} - {offer.plantLocation.address}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Tolerancia Logística:</span>
            <span className="ml-2 font-medium">{offer.logisticsTolerancePct}%</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tabla de Precios - {offer.productForm}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Talla
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio ({offer.priceUnit.replace('PER_', '/')})
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offer.priceTiers
                .filter((tier) => tier.isActive && tier.price > 0)
                .map((tier, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {tier.sizeMin}/{tier.sizeMax}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <Money amount={tier.price} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Requisitos de Calidad
        </h2>
        <ul className="space-y-2">
          {offer.qualityRequirements.map((req, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span className="text-sm text-gray-700">{req.text}</span>
            </li>
          ))}
        </ul>
      </Card>

      {offer.productForm === 'ENTERO' &&
       offer.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE' &&
       offer.colaDirectaPriceTiers &&
       offer.colaDirectaPriceTiers.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Lo no entero se paga como Cola Directa
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            El producto que no califique como entero se pagará según la siguiente tabla de precios (USD/lb).
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Talla</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio (USD/lb)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offer.colaDirectaPriceTiers
                  .filter((tier) => tier.price > 0)
                  .map((tier, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {tier.sizeMin}/{tier.sizeMax}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <Money amount={tier.price} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {hasAdjustments &&
       !(offer.productForm === 'ENTERO' && offer.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE') && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ajustes por Clase
          </h2>
          {offer.guaranteeClassAPct != null && offer.guaranteeClassAPct > 0 && (
            <div className="mb-3">
              <span className="text-sm text-gray-700">
                Garantía clase A: {offer.guaranteeClassAPct}%
              </span>
            </div>
          )}
          {offer.adjustments
            .filter((a) => a.amount !== 0)
            .map((adj, idx) => (
              <div key={idx} className="mb-2">
                <span className="text-sm text-gray-700">
                  Clase {adj.appliesToClass}: Descuento de{' '}
                  <Money amount={adj.amount} /> {adj.unit === 'USD' ? 'por libra' : ''}
                </span>
              </div>
            ))}
        </Card>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Términos de Pago
        </h2>
        <div className="space-y-3">
          {offer.paymentTerms.map((term, idx) => (
            <div key={idx} className="border-l-4 border-primary-500 pl-4">
              <div className="font-medium text-gray-900">
                {term.termType === 'ADVANCE'
                  ? 'Anticipo'
                  : term.termType === 'BALANCE'
                    ? 'Saldo restante'
                    : 'Otro'}
              </div>
              {term.termType === 'CUSTOM' ? (
                <div className="text-sm text-gray-600">{term.text}</div>
              ) : (
                <>
                  <div className="text-sm text-gray-600">
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
                      const horas =
                        term.dueInHours ??
                        (term.dueInDays ? term.dueInDays * 24 : undefined);
                      return horas ? `Vence en ${horas} horas` : '';
                    })()}
                  </div>
                  {term.trigger && (
                    <div className="text-xs text-gray-500 mt-1">
                      Trigger: {term.trigger}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </Card>

      {offer.additionalConditions && offer.additionalConditions.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Condiciones adicionales
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {offer.additionalConditions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
