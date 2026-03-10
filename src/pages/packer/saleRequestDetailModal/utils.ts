import type { SaleRequest, SaleRequestStatus, CatchSettlement, CatchSettlementLine, Offer } from '../../../types';
import { LB_TO_KG } from './constants';

export function createEmptySettlement(request?: SaleRequest | null): CatchSettlement {
  const remitidasReferencialLb = request?.catchInfo?.estimatedQuantityLb ?? 0;
  return {
    entryDate: new Date().toISOString().slice(0, 10),
    lotNumber: '',
    remissionGuide: '',
    pond: '',
    aguaje: '',
    colaDirectaALines: [],
    colaDirectaBLines: [],
    ventaLocalLines: [],
    remitidasReferencialLb,
    basuraColaDirectaLb: 0,
  };
}

export function createEmptyLine(): CatchSettlementLine {
  return {
    id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sizeOrDesc: '',
    pounds: 0,
    unitPrice: 0,
  };
}

type SettlementWithLegacy = CatchSettlement & {
  lineItems?: Array<{ id: string; class: string; sizeOrDesc: string; pounds: number; unitPrice: number }>;
};

/** Migra liquidación antigua (lineItems) al formato de tres tablas, si aplica */
export function normalizeSettlement(s: SettlementWithLegacy): CatchSettlement {
  if (!s.lineItems || s.lineItems.length === 0) {
    const out = { ...s } as CatchSettlement;
    if (!('colaDirectaALines' in out)) (out as CatchSettlement).colaDirectaALines = [];
    if (!('colaDirectaBLines' in out)) (out as CatchSettlement).colaDirectaBLines = [];
    if (!('ventaLocalLines' in out)) (out as CatchSettlement).ventaLocalLines = [];
    return out;
  }
  const colaDirectaALines: CatchSettlementLine[] = [];
  const colaDirectaBLines: CatchSettlementLine[] = [];
  const ventaLocalLines: CatchSettlementLine[] = [];
  for (const it of s.lineItems) {
    const line: CatchSettlementLine = {
      id: it.id,
      sizeOrDesc: it.sizeOrDesc,
      pounds: it.pounds,
      unitPrice: it.unitPrice,
    };
    if (it.class.includes('A COLA') || it.class === 'A COLA DIRECTA') colaDirectaALines.push(line);
    else if (it.class.includes('B COLA') || it.class === 'B COLA DIRECTA') colaDirectaBLines.push(line);
    else ventaLocalLines.push(line);
  }
  const { lineItems: _, ...rest } = s;
  return {
    ...rest,
    colaDirectaALines,
    colaDirectaBLines,
    ventaLocalLines,
  } as CatchSettlement;
}

export function getProductFormLabel(form: string): string {
  const labels: Record<string, string> = {
    ENTERO: 'Whole',
    COLA_DIRECTA: 'Direct Tail',
    CAMARON_VIVO: 'Live Shrimp',
    SOBRANTE: 'Surplus',
    COLA_SOBRANTE: 'Tail Surplus',
  };
  return labels[form] || form;
}

export function getStatusLabel(status: SaleRequestStatus): string {
  const labels: Record<SaleRequestStatus, string> = {
    LOGISTICS_QUOTE_IN_PROGRESS: 'Quote in progress',
    LOGISTICS_QUOTE_PENDING_ACCEPTANCE: 'Quote pending acceptance',
    PENDING_ACCEPTANCE: 'Pending acceptance',
    CATCH_SETTLEMENT_PENDING: 'Catch settlement pending',
    ADVANCE_PENDING: 'Advance pending',
    BALANCE_PENDING: 'Balance pending',
    SALE_COMPLETED: 'Sale completed',
    REJECTED: 'Rejected',
    PENDING_PICKUP: 'Pending pickup',
    PENDING_DELIVERY: 'Pending delivery',
    PICKED_UP: 'Pending acceptance',
    DELIVERED: 'Delivered',
  };
  return labels[status];
}

/**
 * Devuelve el precio por unidad de la oferta para la talla de la solicitud (y la unidad).
 * Para usar en "Precio de la talla".
 */
export function getPriceTierForRequest(
  request: SaleRequest,
  offer: Offer | null
): { price: number; unit: 'PER_LB' | 'PER_KG' } | null {
  if (!offer?.priceTiers?.length) return null;
  const { sizeRange } = request.catchInfo;
  const tier = offer.priceTiers.find(
    (t) => t.isActive && t.sizeMin <= sizeRange.min && t.sizeMax >= sizeRange.min
  );
  if (!tier) return null;
  return { price: tier.price, unit: offer.priceUnit };
}

/**
 * Calcula el posible total de la pesca (cantidad estimada × precio de la oferta para la talla).
 * Devuelve null si no hay oferta o no hay tier que coincida con el rango de tallas.
 */
export function getEstimatedCatchTotalFromOffer(
  request: SaleRequest,
  offer: Offer | null
): number | null {
  if (!offer?.priceTiers?.length) return null;
  const { sizeRange, estimatedQuantityLb } = request.catchInfo;
  const tier = offer.priceTiers.find(
    (t) => t.isActive && t.sizeMin <= sizeRange.min && t.sizeMax >= sizeRange.min
  );
  if (!tier) return null;
  if (offer.priceUnit === 'PER_LB') {
    return estimatedQuantityLb * tier.price;
  }
  const quantityKg = estimatedQuantityLb * LB_TO_KG;
  return quantityKg * tier.price;
}
