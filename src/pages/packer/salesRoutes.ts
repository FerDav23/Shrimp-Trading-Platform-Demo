import type { SaleRequestStatus } from '../../types';

export type SalesViewFilter = SaleRequestStatus;

/** Vista "todas las solicitudes" (todos los estados) */
export const VIEW_ALL = 'ALL' as const;
export type SalesViewTab = SalesViewFilter | typeof VIEW_ALL;

/** Slug usado en la URL para cada estado de solicitud y para "todas" */
export const STATUS_TO_SLUG: Record<SalesViewFilter, string> = {
  PENDING_ACCEPTANCE: 'pendientes-de-aceptar',
  CATCH_SETTLEMENT_PENDING: 'liquidacion-pesca-pendiente',
  ADVANCE_PENDING: 'anticipo-pendiente',
  BALANCE_PENDING: 'saldo-restante-pendiente',
  SALE_COMPLETED: 'venta-finalizada',
  REJECTED: 'rechazadas',
};

export const SLUG_VIEW_ALL = 'todas';

const SLUG_TO_STATUS: Record<string, SalesViewFilter> = Object.fromEntries(
  (Object.entries(STATUS_TO_SLUG) as [SalesViewFilter, string][]).map(([k, v]) => [v, k])
);

export const DEFAULT_SALES_VIEW: SalesViewFilter = 'PENDING_ACCEPTANCE';

export function slugToStatus(slug: string | undefined): SalesViewFilter | null {
  if (!slug) return null;
  return SLUG_TO_STATUS[slug] ?? null;
}

/** Parsea el query param ?view= a SalesViewTab. */
export function slugToViewTab(slug: string | undefined): SalesViewTab {
  if (!slug || slug === SLUG_VIEW_ALL) return VIEW_ALL;
  const status = SLUG_TO_STATUS[slug];
  return status ?? VIEW_ALL;
}

/** Slug del tab actual para la URL (?view=). */
export function viewTabToSlug(tab: SalesViewTab): string {
  if (tab === VIEW_ALL) return SLUG_VIEW_ALL;
  return STATUS_TO_SLUG[tab];
}

export function statusToPath(status: SalesViewFilter): string {
  return `/packer/sales?view=${STATUS_TO_SLUG[status]}`;
}

/** Tabs de la página de Compras: Todas + cada estado. */
export const SALES_VIEW_TABS: { tab: SalesViewTab; label: string }[] = [
  { tab: VIEW_ALL, label: 'Todas las solicitudes' },
  { tab: 'PENDING_ACCEPTANCE', label: 'Pendientes de Aceptar' },
  { tab: 'CATCH_SETTLEMENT_PENDING', label: 'Liquidación de Pesca pendiente' },
  { tab: 'ADVANCE_PENDING', label: 'Anticipo Pendiente' },
  { tab: 'BALANCE_PENDING', label: 'Saldo Restante Pendiente' },
  { tab: 'SALE_COMPLETED', label: 'Venta Finalizada' },
  { tab: 'REJECTED', label: 'Rechazadas' },
];

/** Solo los estados (sin "Todas"), para listados por estado en dashboard etc. */
export const SALES_STATUS_TABS = SALES_VIEW_TABS.filter(
  (t): t is { tab: SalesViewFilter; label: string } => t.tab !== VIEW_ALL
);
