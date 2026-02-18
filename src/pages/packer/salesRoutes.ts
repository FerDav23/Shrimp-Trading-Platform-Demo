import type { SaleRequestStatus } from '../../types';

export type SalesViewFilter = SaleRequestStatus;

/** Slug usado en la URL para cada estado de solicitud */
export const STATUS_TO_SLUG: Record<SalesViewFilter, string> = {
  PENDING_ACCEPTANCE: 'pendientes-de-aceptar',
  CATCH_SETTLEMENT_PENDING: 'liquidacion-pesca-pendiente',
  ADVANCE_PENDING: 'anticipo-pendiente',
  BALANCE_PENDING: 'saldo-restante-pendiente',
  SALE_COMPLETED: 'venta-finalizada',
  REJECTED: 'rechazadas',
};

const SLUG_TO_STATUS: Record<string, SalesViewFilter> = Object.fromEntries(
  (Object.entries(STATUS_TO_SLUG) as [SalesViewFilter, string][]).map(([k, v]) => [v, k])
);

export const DEFAULT_SALES_VIEW: SalesViewFilter = 'PENDING_ACCEPTANCE';

export function slugToStatus(slug: string | undefined): SalesViewFilter | null {
  if (!slug) return null;
  return SLUG_TO_STATUS[slug] ?? null;
}

export function statusToPath(status: SalesViewFilter): string {
  return `/packer/sales/${STATUS_TO_SLUG[status]}`;
}

export const SALES_NAV_ITEMS: { status: SalesViewFilter; label: string }[] = [
  { status: 'PENDING_ACCEPTANCE', label: 'Pendientes de Aceptar' },
  { status: 'CATCH_SETTLEMENT_PENDING', label: 'Liquidación de Pesca pendiente' },
  { status: 'ADVANCE_PENDING', label: 'Anticipo Pendiente' },
  { status: 'BALANCE_PENDING', label: 'Saldo Restante Pendiente' },
  { status: 'SALE_COMPLETED', label: 'Venta Finalizada' },
  { status: 'REJECTED', label: 'Rechazadas' },
];
