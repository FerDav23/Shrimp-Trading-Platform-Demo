import type { SaleRequestStatus } from '../../types';

export type SalesViewFilter = SaleRequestStatus;

/** Solo los 6 estados del flujo (sin los 4 de logística); usados para tabs por estado y URLs */
export type WorkflowStatus =
  | 'PENDING_ACCEPTANCE'
  | 'CATCH_SETTLEMENT_PENDING'
  | 'ADVANCE_PENDING'
  | 'BALANCE_PENDING'
  | 'SALE_COMPLETED'
  | 'REJECTED';

/** Vista "todas las solicitudes" (todos los estados) */
export const VIEW_ALL = 'ALL' as const;
/** Tab de vista: solicitudes con tracking logístico activo */
export const TAB_LOGISTICS_TRACKING = 'LOGISTICS_TRACKING' as const;
export type SalesViewTab = SalesViewFilter | typeof VIEW_ALL | typeof TAB_LOGISTICS_TRACKING;

/** Slug usado en la URL para cada estado del flujo (los 6 workflow) */
export const STATUS_TO_SLUG: Record<WorkflowStatus, string> = {
  PENDING_ACCEPTANCE: 'pendientes-de-aceptar',
  CATCH_SETTLEMENT_PENDING: 'liquidacion-pesca-pendiente',
  ADVANCE_PENDING: 'anticipo-pendiente',
  BALANCE_PENDING: 'saldo-restante-pendiente',
  SALE_COMPLETED: 'venta-finalizada',
  REJECTED: 'rechazadas',
};

export const SLUG_VIEW_ALL = 'todas';
/** Vista especial: solicitudes con tracking logístico (para probar la implementación) */
export const SLUG_LOGISTICS_TRACKING = 'tracking-logistico';

const SLUG_TO_STATUS: Record<string, WorkflowStatus> = Object.fromEntries(
  (Object.entries(STATUS_TO_SLUG) as [WorkflowStatus, string][]).map(([k, v]) => [v, k])
);

export const DEFAULT_SALES_VIEW: WorkflowStatus = 'PENDING_ACCEPTANCE';

export function slugToStatus(slug: string | undefined): WorkflowStatus | null {
  if (!slug) return null;
  return SLUG_TO_STATUS[slug] ?? null;
}

/** Parsea el query param ?view= a SalesViewTab. */
export function slugToViewTab(slug: string | undefined): SalesViewTab {
  if (!slug || slug === SLUG_VIEW_ALL) return VIEW_ALL;
  if (slug === SLUG_LOGISTICS_TRACKING) return TAB_LOGISTICS_TRACKING;
  const status = SLUG_TO_STATUS[slug];
  return status ?? VIEW_ALL;
}

/** Slug del tab actual para la URL (?view=). */
export function viewTabToSlug(tab: SalesViewTab): string {
  if (tab === VIEW_ALL) return SLUG_VIEW_ALL;
  if (tab === TAB_LOGISTICS_TRACKING) return SLUG_LOGISTICS_TRACKING;
  return STATUS_TO_SLUG[tab as WorkflowStatus];
}

export function statusToPath(status: WorkflowStatus): string {
  return `/packer/sales?view=${STATUS_TO_SLUG[status]}`;
}

/** Tabs de la página de Compras: Todas + cada estado + tracking logístico. */
export const SALES_VIEW_TABS: { tab: SalesViewTab; label: string }[] = [
  { tab: VIEW_ALL, label: 'Todas las solicitudes' },
  { tab: 'PENDING_ACCEPTANCE', label: 'Pendientes de Aceptar' }, 
  { tab: TAB_LOGISTICS_TRACKING, label: 'Logistica' },
  { tab: 'CATCH_SETTLEMENT_PENDING', label: 'Liquidación de Pesca pendiente' },
  { tab: 'ADVANCE_PENDING', label: 'Anticipo Pendiente' },
  { tab: 'BALANCE_PENDING', label: 'Saldo Restante Pendiente' },
  { tab: 'SALE_COMPLETED', label: 'Venta Finalizada' },
  { tab: 'REJECTED', label: 'Rechazadas' },
];

/** Solo los 6 estados del flujo (sin "Todas" ni "Tracking logístico"), para dashboard etc. */
export const SALES_STATUS_TABS = SALES_VIEW_TABS.filter(
  (t): t is { tab: WorkflowStatus; label: string } => t.tab !== VIEW_ALL && t.tab !== TAB_LOGISTICS_TRACKING
);
