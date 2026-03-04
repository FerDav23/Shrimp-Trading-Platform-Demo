import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { page, packerSales } from '../../styles';
import { dummySaleRequests } from '../../data/saleRequests';
import { SaleRequest, LogisticsDeliveryConfirm, SaleRequestStatus, isLogisticsTrackingStatus } from '../../types';
import { SaleRequestDetailModal } from './saleRequestDetailModal';
import { getStatusLabel as getRequestStatusLabel } from './saleRequestDetailModal/utils';
import {
  SALES_VIEW_TABS,
  slugToViewTab,
  viewTabToSlug,
  TAB_LOGISTICS_TRACKING,
  VIEW_ALL,
  type SalesViewTab,
  type WorkflowStatus,
} from './salesRoutes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TAB_LABELS: Record<WorkflowStatus, string> = {
  PENDING_ACCEPTANCE: 'Pendientes de Aceptar',
  CATCH_SETTLEMENT_PENDING: 'Liquidación de Pesca pendiente',
  ADVANCE_PENDING: 'Anticipo Pendiente',
  BALANCE_PENDING: 'Saldo Restante Pendiente',
  SALE_COMPLETED: 'Venta Finalizada',
  REJECTED: 'Rechazada',
};

const SECTION_TITLES: Record<WorkflowStatus, string> = {
  PENDING_ACCEPTANCE: 'Solicitudes Pendientes de Aceptar',
  CATCH_SETTLEMENT_PENDING: 'Solicitudes con Liquidación de Pesca pendiente',
  ADVANCE_PENDING: 'Solicitudes con Anticipo Pendiente',
  BALANCE_PENDING: 'Solicitudes con Saldo Restante Pendiente',
  SALE_COMPLETED: 'Solicitudes con Venta Finalizada',
  REJECTED: 'Solicitudes Rechazadas',
};

function getTabLabel(status: SalesViewTab): string {
  if (status === VIEW_ALL) return 'Todas las solicitudes';
  if (status === TAB_LOGISTICS_TRACKING) return 'Tracking logístico';
  return TAB_LABELS[status as WorkflowStatus];
}

function getSectionTitle(tab: SalesViewTab): string {
  if (tab === VIEW_ALL) return 'Todas las solicitudes de compra';
  if (tab === TAB_LOGISTICS_TRACKING) return 'Solicitudes con Logistica Pendiente';
  return SECTION_TITLES[tab as WorkflowStatus];
}

/** Clase de badge para cualquier estado (flujo + logística) */
const STATUS_CLASSES: Record<SaleRequestStatus, string> = {
  PENDING_ACCEPTANCE: packerSales.colStatusPendingAcceptance,
  CATCH_SETTLEMENT_PENDING: packerSales.colStatusCatchSettlement,
  ADVANCE_PENDING: packerSales.colStatusAdvancePending,
  BALANCE_PENDING: packerSales.colStatusBalancePending,
  SALE_COMPLETED: packerSales.colStatusSaleCompleted,
  REJECTED: packerSales.colStatusRejected,
  PENDING_PICKUP: packerSales.colStatusLogisticsPendingPickup,
  PENDING_DELIVERY: packerSales.colStatusLogisticsPendingDelivery,
  PICKED_UP: packerSales.colStatusLogisticsPickedUp,
  DELIVERED: packerSales.colStatusLogisticsDelivered,
};

function getStatusClass(status: SalesViewTab): string {
  if (status === VIEW_ALL) return packerSales.colStatus;
  if (status === TAB_LOGISTICS_TRACKING) return packerSales.colStatusLogisticsTracking;
  return STATUS_CLASSES[status] ?? packerSales.colStatus;
}

export const PackerSales: React.FC = () => {
  useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewSlug = searchParams.get('view') ?? undefined;
  const activeTab: SalesViewTab = slugToViewTab(viewSlug);

  const packerId = 'packer-rosasud';
  const allRequests = useMemo(
    () => dummySaleRequests.filter((r) => r.packingCompanyId === packerId),
    []
  );

  const filteredRequests =
    activeTab === VIEW_ALL
      ? allRequests
      : activeTab === TAB_LOGISTICS_TRACKING
        ? allRequests.filter((r) => isLogisticsTrackingStatus(r.status))
        : allRequests.filter((r) => r.status === activeTab);

  const [selectedRequest, setSelectedRequest] = useState<SaleRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settlementSentIds, setSettlementSentIds] = useState<Set<string>>(new Set());
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [deliveryConfirmed, setDeliveryConfirmed] = useState<Record<string, LogisticsDeliveryConfirm>>({});

  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollArrows = () => {
    const el = tabsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    updateScrollArrows();
    const ro = new ResizeObserver(updateScrollArrows);
    ro.observe(el);
    el.addEventListener('scroll', updateScrollArrows);
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', updateScrollArrows);
    };
  }, []);

  const scrollTabs = (direction: 'left' | 'right') => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 2.5;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };

  const setActiveTab = (tab: SalesViewTab) => {
    setSearchParams({ view: viewTabToSlug(tab) });
  };

  const handleRowClick = (request: SaleRequest) => {
    const confirmed = deliveryConfirmed[request.id];
    setSelectedRequest(
      confirmed
        ? { ...request, status: 'DELIVERED', logisticsDelivery: confirmed }
        : request
    );
    setIsModalOpen(true);
  };

  const handleAccept = (requestId: string) => {
    alert(`Solicitud ${requestId} aceptada (simulado)`);
  };

  const handleReject = (requestId: string, reason?: string, notes?: string) => {
    if (reason) setRejectionReasons((prev) => ({ ...prev, [requestId]: reason }));
    alert(`Solicitud ${requestId} rechazada${reason ? `: ${reason}` : ''}${notes ? ` | ${notes}` : ''} (simulado)`);
  };

  const handleSendSettlement = (requestId: string) => {
    setSettlementSentIds((prev) => new Set(prev).add(requestId));
  };

  const handleCancelPurchase = (requestId: string) => {
    alert(`Cancelar compra para solicitud ${requestId} (simulado)`);
  };

  const handleSendAdvanceProof = (requestId: string) => {
    alert(`Prueba de anticipo enviada para solicitud ${requestId} (simulado)`);
  };

  const handleSendBalanceProof = (requestId: string) => {
    alert(`Prueba de saldo enviada para solicitud ${requestId} (simulado)`);
  };

  const handleConfirmDelivery = (requestId: string, data: LogisticsDeliveryConfirm) => {
    setDeliveryConfirmed((prev) => ({ ...prev, [requestId]: data }));
    alert(`Recepción de carga registrada para solicitud ${requestId} (simulado)`);
  };

  const isAllView = activeTab === VIEW_ALL;

  const columns = [
    {
      header: 'Productor',
      accessor: (request: SaleRequest) => (
        <div>
          <div className={packerSales.colProducerName}>{request.producerName}</div>
        </div>
      ),
    },
    {
      header: 'Producto',
      accessor: (request: SaleRequest) => (
        <span className={packerSales.colProduct}>{request.productForm}</span>
      ),
    },
    {
      header: 'Información de Pesca',
      accessor: (request: SaleRequest) => (
        <div className="text-sm">
          <div className={packerSales.colCatchQty}>
            {request.catchInfo.estimatedQuantityLb} lb
          </div>
          <div className={packerSales.colCatchSub}>
            Talla: {request.catchInfo.sizeRange.min}/{request.catchInfo.sizeRange.max}
          </div>
          <div className={packerSales.colCatchMeta}>
            Cosecha: {format(new Date(request.catchInfo.estimatedHarvestDate), 'dd MMM yyyy', { locale: es })}
          </div>
        </div>
      ),
    },
    {
      header: 'Ubicación',
      accessor: (request: SaleRequest) => (
        <div className="text-sm">
          <div className={packerSales.colLocationMain}>{request.catchInfo.harvestLocation.city}</div>
          <div className={packerSales.colLocationSub}>{request.catchInfo.harvestLocation.address}</div>
        </div>
      ),
    },
    {
      header: 'Fecha Solicitud',
      accessor: (request: SaleRequest) => (
        <span className={packerSales.colDate}>
          {format(new Date(request.createdAt), 'dd MMM yyyy', { locale: es })}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: (request: SaleRequest) => {
        const awaiting = settlementSentIds.has(request.id);
        const showRequestStatus = isAllView || activeTab === TAB_LOGISTICS_TRACKING;
        const statusLabel = awaiting
          ? 'En espera de confirmación'
          : showRequestStatus
            ? getRequestStatusLabel(request.status)
            : getTabLabel(activeTab);
        const statusClass = awaiting
          ? packerSales.colStatusAwaiting
          : showRequestStatus
            ? STATUS_CLASSES[request.status]
            : getStatusClass(activeTab);
        return (
          <span className={statusClass}>
            {statusLabel}
          </span>
        );
      },
    },
  ];

  const emptyMessage =
    activeTab === VIEW_ALL
      ? 'No hay solicitudes de compra.'
      : activeTab === TAB_LOGISTICS_TRACKING
        ? 'No hay solicitudes con tracking logístico. Acepte una solicitud para ver el tab Compras.'
        : `No hay solicitudes ${getTabLabel(activeTab).toLowerCase()} disponibles.`;

  return (
    <div className={packerSales.pageLayout}>
      <div className={page.headerWithSubtitle}>
        <h1 className={page.headerTitle}>Compras</h1>
        <p className={page.headerSubtitle}>{getSectionTitle(activeTab)}</p>
      </div>

      {/* Tabs + título de sección fijos; solo la tabla hace scroll */}
      <div className={packerSales.stickyHeader}>
        <div className={packerSales.tabsOuter}>
          <div className={packerSales.tabsBar}>
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollTabs('left')}
                className={packerSales.tabArrow}
                aria-label="Ver opciones anteriores"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div
              ref={tabsScrollRef}
              className={packerSales.tabScroll}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {SALES_VIEW_TABS.map(({ tab, label }) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab === VIEW_ALL ? 'ALL' : tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`${packerSales.tabButton} ${isActive ? packerSales.tabButtonActive : packerSales.tabButtonInactive}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollTabs('right')}
                className={packerSales.tabArrow}
                aria-label="Ver más opciones"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <h3 className={packerSales.sectionTitle}>
          {getSectionTitle(activeTab)}
        </h3>
      </div>

      <div className={packerSales.tableScrollWrap}>
        <div className={packerSales.tableOuter}>
          {filteredRequests.length === 0 ? (
            <div className={packerSales.tableEmpty}>
              <p className={packerSales.tableEmptyText}>{emptyMessage}</p>
            </div>
          ) : (
            <div className={packerSales.tableScroll}>
              <table className={packerSales.table}>
                <thead className={packerSales.thead}>
                  <tr>
                    {columns.map((column, idx) => (
                      <th key={idx} className={packerSales.th}>
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={packerSales.tbody}>
                  {filteredRequests.map((request) => {
                    const isAwaitingConfirmation = settlementSentIds.has(request.id);
                    return (
                      <tr
                        key={request.id}
                        onClick={() => !isAwaitingConfirmation && handleRowClick(request)}
                        className={isAwaitingConfirmation ? packerSales.trDisabled : packerSales.trClickable}
                      >
                        {columns.map((column, colIdx) => (
                          <td key={colIdx} className={packerSales.td}>
                            {typeof column.accessor === 'function'
                              ? column.accessor(request)
                              : String(request[column.accessor as keyof SaleRequest])}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <SaleRequestDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onAccept={handleAccept}
        onReject={handleReject}
        rejectionReasons={rejectionReasons}
        onSendSettlement={handleSendSettlement}
        onCancelPurchase={handleCancelPurchase}
        onSendAdvanceProof={handleSendAdvanceProof}
        onSendBalanceProof={handleSendBalanceProof}
        onConfirmDelivery={handleConfirmDelivery}
      />
    </div>
  );
};
