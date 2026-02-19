import type { SaleRequest, SaleRequestStatus, CatchSettlement, CatchSettlementLine } from '../../../types';

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
    ENTERO: 'Entero',
    COLA_DIRECTA: 'Cola Directa',
    CAMARON_VIVO: 'Camarón Vivo',
    SOBRANTE: 'Sobrante',
    COLA_SOBRANTE: 'Cola Sobrante',
  };
  return labels[form] || form;
}

export function getStatusLabel(status: SaleRequestStatus): string {
  const labels: Record<SaleRequestStatus, string> = {
    PENDING_ACCEPTANCE: 'Pendientes de Aceptar',
    CATCH_SETTLEMENT_PENDING: 'Liquidación de Pesca pendiente',
    ADVANCE_PENDING: 'Anticipo Pendiente',
    BALANCE_PENDING: 'Saldo Restante Pendiente',
    SALE_COMPLETED: 'Venta Finalizada',
    REJECTED: 'Rechazada',
  };
  return labels[status];
}
